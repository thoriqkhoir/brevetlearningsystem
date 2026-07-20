<?php

namespace App\Http\Controllers;

use App\Models\Bupot;
use App\Models\Course;
use App\Models\CourseResult;
use App\Models\CourseSchedule;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use App\Models\CourseUser;
use App\Models\Invoice;
use App\Models\Other;
use App\Models\Retur;
use App\Models\ReturOther;
use App\Models\Spt;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseUserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $courses = Course::whereHas('participants', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
            ->with([
                'participants' => function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                },
                'courseTests',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $courseIds = $courses->pluck('id')->values();
        $tz = 'Asia/Jakarta';
        $todayStart = now($tz)->startOfDay();
        $now = now($tz);

        $upcomingSchedulesByCourse = collect();
        $upcomingTestsByCourse = collect();

        if ($courseIds->isNotEmpty()) {
            $upcomingSchedulesByCourse = CourseSchedule::whereIn('course_id', $courseIds)
                ->whereNotNull('scheduled_at')
                ->whereDate('scheduled_at', '>=', $todayStart->toDateString())
                ->orderBy('scheduled_at')
                ->get()
                ->groupBy('course_id')
                ->map(fn($items) => $items->first());

            $upcomingTestsByCourse = CourseTest::whereIn('course_id', $courseIds)
                ->whereNotNull('start_date')
                ->where(function ($query) use ($todayStart, $now) {
                    $query->whereDate('start_date', '>=', $todayStart->toDateString())
                        ->orWhere(function ($ongoingQuery) use ($now) {
                            $ongoingQuery->whereNotNull('end_date')
                                ->where('start_date', '<=', $now)
                                ->where('end_date', '>=', $now);
                        });
                })
                ->orderBy('start_date')
                ->get()
                ->groupBy('course_id');
        }

        $courses = $courses->map(function ($course) use ($user, $upcomingSchedulesByCourse, $upcomingTestsByCourse, $tz, $todayStart, $now) {
            $pivot = $course->participants->first();

            $averageScore = null;
            if ($pivot) {
                $courseResults = CourseResult::where('course_user_id', $pivot->id)->get();

                if ($courseResults->count() > 0) {
                    $validScores = $courseResults->whereNotNull('score')->pluck('score');

                    if ($validScores->count() > 0) {
                        $averageScore = round($validScores->avg(), 2);
                    }
                }

                $course->score = $averageScore;
            } else {
                $course->score = null;
            }

            $nextSchedule = $upcomingSchedulesByCourse->get($course->id);
            $testCandidates = $upcomingTestsByCourse->get($course->id, collect());

            $nextTest = null;
            $nextTestAt = null;
            $nextTestEndAt = null;
            $isTestOngoing = false;

            $nextScheduleAt = $nextSchedule?->getRawOriginal('scheduled_at')
                ? $this->parseScheduleDateTime($nextSchedule->getRawOriginal('scheduled_at'), $tz)
                : null;

            foreach ($testCandidates as $candidate) {
                $candidateStartAt = $candidate?->getRawOriginal('start_date')
                    ? $this->parseScheduleDateTime($candidate->getRawOriginal('start_date'), $tz)
                    : null;
                $candidateEndAt = $candidate?->getRawOriginal('end_date')
                    ? $this->parseScheduleDateTime($candidate->getRawOriginal('end_date'), $tz)
                    : null;

                if (!$candidateStartAt) {
                    continue;
                }

                if ($candidateEndAt && $now->betweenIncluded($candidateStartAt, $candidateEndAt)) {
                    $nextTest = $candidate;
                    $nextTestAt = $candidateStartAt;
                    $nextTestEndAt = $candidateEndAt;
                    $isTestOngoing = true;
                    break;
                }

                if (!$nextTest && $candidateStartAt->gte($todayStart)) {
                    $nextTest = $candidate;
                    $nextTestAt = $candidateStartAt;
                    $nextTestEndAt = $candidateEndAt;
                }
            }

            if ($nextScheduleAt && $nextScheduleAt->lt($todayStart)) {
                $nextScheduleAt = null;
            }

            if ($nextTestAt && $nextTestAt->lt($todayStart)) {
                $nextTestAt = null;
            }

            $nextScheduleUpcoming = $nextScheduleAt ? [
                'type' => 'schedule',
                'label' => 'Jadwal Kelas',
                'title' => $nextSchedule->title,
                'starts_at' => $nextScheduleAt->format('Y-m-d H:i:s'),
            ] : null;

            $nextTestUpcoming = $nextTestAt ? [
                'type' => 'test',
                'label' => 'Ujian Kelas',
                'title' => $nextTest->title,
                'starts_at' => $nextTestAt->format('Y-m-d H:i:s'),
                'ends_at' => $nextTestEndAt?->format('Y-m-d H:i:s'),
                'state' => $isTestOngoing ? 'ongoing' : 'upcoming',
            ] : null;

            $nextUpcoming = null;

            if ($nextScheduleAt && (!$nextTestAt || $nextScheduleAt->lte($nextTestAt))) {
                $nextUpcoming = [
                    'type' => 'schedule',
                    'label' => 'Jadwal Kelas',
                    'title' => $nextSchedule->title,
                    'starts_at' => $nextScheduleAt->format('Y-m-d H:i:s'),
                ];
            } elseif ($nextTestAt) {
                $nextUpcoming = [
                    'type' => 'test',
                    'label' => 'Ujian Kelas',
                    'title' => $nextTest->title,
                    'starts_at' => $nextTestAt->format('Y-m-d H:i:s'),
                ];
            }

            $course->next_schedule_upcoming = $nextScheduleUpcoming;
            $course->next_test_upcoming = $nextTestUpcoming;
            $course->next_upcoming = $nextUpcoming;

            $rawStart = $course->getRawOriginal('start_date');
            $rawEnd   = $course->getRawOriginal('end_date');
            $courseStart = $rawStart ? $this->parseScheduleDateTime($rawStart, $tz) : null;
            $courseEnd   = $rawEnd   ? $this->parseScheduleDateTime($rawEnd,   $tz) : null;

            if (!$courseStart && !$courseEnd) {
                $course->course_status = 'ongoing';
            } elseif ($courseStart && $now->lt($courseStart)) {
                $course->course_status = 'upcoming';
            } elseif ($courseEnd && $now->gt($courseEnd)) {
                $course->course_status = 'finished';
            } else {
                $course->course_status = 'ongoing';
            }

            $hasActiveRemedial = false;
            $remedialDeadline = null;

            $testIds = $course->courseTests->pluck('id');
            $allAttempts = CourseTestAttempt::where('user_id', $user->id)
                ->whereIn('course_test_id', $testIds)
                ->whereNotNull('submitted_at')
                ->get()
                ->groupBy('course_test_id');

            $courseEndParsed = $courseEnd;
            $remedialStart = $courseEndParsed ? $courseEndParsed->copy()->addDay()->startOfDay() : null;

            foreach ($course->courseTests as $courseTest) {
                if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
                    $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;
                    if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                        $attemptsForTest = $allAttempts->get($courseTest->id, collect());
                        $passingScore = (int) ($courseTest->passing_score ?? 70);
                        $bestScore = $attemptsForTest->max('score');
                        $isFailed = is_null($bestScore) || $bestScore < $passingScore;

                        if ($isFailed) {
                            $hasActiveRemedial = true;
                            if ($remedialEnd) {
                                if (!$remedialDeadline || $remedialEnd->greaterThan($remedialDeadline)) {
                                    $remedialDeadline = $remedialEnd;
                                }
                            }
                        }
                    }
                }
            }

            $course->has_active_remedial = $hasActiveRemedial;
            $course->remedial_deadline = $remedialDeadline ? $remedialDeadline->toIso8601String() : null;

            return $course;
        });

        return Inertia::render('Course/Courses', [
            'courses' => $courses,
        ]);
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:courses,code',
        ]);

        $course = Course::where('code', $request->code)->first();

        $exists = CourseUser::where('course_id', $course->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Anda sudah bergabung di kelas ini.');
        }

        CourseUser::create([
            'course_id' => $course->id,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Berhasil bergabung ke kelas!');
    }

    public function detail($id)
    {
        $user = Auth::user();
        $course = Course::with('user')
            ->with('courseSchedules')
            ->with(['courseTests' => function ($query) {
                $query->with('questionBank');
            }])
            ->withCount('modules')
            ->findOrFail($id);

        $pivot = CourseUser::where('course_id', $id)
            ->where('user_id', $user->id)
            ->first();

        $courseResults = [];
        if ($pivot) {
            $courseResults = CourseResult::where('course_user_id', $pivot->id)->get();
        }

        $invoiceIds = CourseResult::where('course_user_id', $pivot->id ?? 0)
            ->whereNotNull('invoice_id')
            ->pluck('invoice_id')
            ->toArray();
        $fakturs = Invoice::whereIn('id', $invoiceIds)->get();

        $returIds = CourseResult::where('course_user_id', $pivot->id ?? 0)
            ->whereNotNull('retur_id')
            ->pluck('retur_id')
            ->toArray();
        $returs = Retur::with('invoice')->whereIn('id', $returIds)->get();

        $otherIds = CourseResult::where('course_user_id', $pivot->id ?? 0)
            ->whereNotNull('other_id')
            ->pluck('other_id')
            ->toArray();
        $others = Other::whereIn('id', $otherIds)->get();

        $returOtherIds = CourseResult::where('course_user_id', $pivot->id ?? 0)
            ->whereNotNull('retur_other_id')
            ->pluck('retur_other_id')
            ->toArray();
        $returOthers = ReturOther::with('other')->whereIn('id', $returOtherIds)->get();

        $bupotIds = CourseResult::where('course_user_id', $pivot->id ?? 0)
            ->whereNotNull('bupot_id')
            ->pluck('bupot_id')
            ->toArray();
        $bupots = Bupot::with('object')->whereIn('id', $bupotIds)->get();

        $sptIds = CourseResult::where('course_user_id', $pivot->id ?? 0)
            ->whereNotNull('spt_id')
            ->pluck('spt_id')
            ->toArray();
        $spts = Spt::with('form')->whereIn('id', $sptIds)->orderBy('updated_at', 'desc')->get();

        $active_course_id = session('active_course_id');

        $courseTests = $course->courseTests;
        if ($courseTests->isNotEmpty()) {
            $attempts = CourseTestAttempt::where('user_id', $user->id)
                ->whereIn('course_test_id', $courseTests->pluck('id'))
                ->whereNotNull('submitted_at')
                ->orderBy('submitted_at', 'desc')
                ->get()
                ->groupBy('course_test_id');

            $courseTests = $courseTests->map(function ($courseTest) use ($attempts, $user, $course) {
                $attemptItems = $attempts->get($courseTest->id);
                $attemptCount = $attemptItems ? $attemptItems->count() : 0;
                
                // Regular attempts info
                $regularAttempts = $attemptItems ? $attemptItems->where('test_type', 'exam') : collect();
                $regularCount = $regularAttempts->count();
                
                $maxAttempts = max(0, (int) ($courseTest->max_attempts ?? 0));
                
                // Remedial check
                $isRemedialActive = false;
                $isRemedialEligible = false;
                
                $tz = 'Asia/Jakarta';
                $now = now($tz);
                $courseEnd = $course->end_date ? Carbon::parse($course->end_date, $tz) : null;
                $remedialStart = $courseEnd ? $courseEnd->copy()->addDay()->startOfDay() : null;
                $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;
                
                $passingScore = (int) ($courseTest->passing_score ?? 70);
                $bestRegularScore = $regularAttempts->max('score');
                $isFailedRegular = is_null($bestRegularScore) || $bestRegularScore < $passingScore;
                
                if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
                    if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                        $isRemedialActive = true;
                    }
                    $isRemedialEligible = $isFailedRegular;
                }
                
                // Best score overall (exam or remedial)
                $bestAttempt = $attemptItems?->reduce(function ($best, $current) {
                    if (!$best) {
                        return $current;
                    }

                    $bestScore = (int) $best->score;
                    $currentScore = (int) $current->score;

                    if ($currentScore > $bestScore) {
                        return $current;
                    }

                    if ($currentScore === $bestScore) {
                        $bestSubmittedAt = optional($best->submitted_at)->timestamp ?? 0;
                        $currentSubmittedAt = optional($current->submitted_at)->timestamp ?? 0;

                        if ($currentSubmittedAt > $bestSubmittedAt) {
                            return $current;
                        }
                    }

                    return $best;
                });
                
                // For remedial phase, attempts_used and attempts_remaining should adapt:
                if ($isRemedialActive && $isRemedialEligible) {
                    $bestRemedialScore = $attemptItems ? $attemptItems->where('test_type', 'remedial')->max('score') : 0;
                    $hasPassedRemedial = ($bestRegularScore >= $passingScore) || ($bestRemedialScore >= $passingScore);
                    
                    $courseTest->setAttribute('is_remedial_mode', true);
                    $courseTest->setAttribute('is_remedial_eligible', true);
                    $courseTest->setAttribute('remedial_status', $hasPassedRemedial ? 'passed' : 'active');
                    
                    $courseTest->setAttribute('attempts_used', $attemptCount);
                    $courseTest->setAttribute('attempts_remaining', $hasPassedRemedial ? 0 : null);
                    $courseTest->setAttribute('attempts_status', $hasPassedRemedial ? 'exhausted' : 'unlimited');
                } else {
                    $courseTest->setAttribute('is_remedial_mode', false);
                    $courseTest->setAttribute('is_remedial_eligible', false);
                    $courseTest->setAttribute('remedial_status', 'none');
                    
                    $attemptsRemaining = $maxAttempts > 0 ? max($maxAttempts - $regularCount, 0) : null;
                    $courseTest->setAttribute('attempts_used', $regularCount);
                    $courseTest->setAttribute('attempts_remaining', $attemptsRemaining);
                    $courseTest->setAttribute('attempts_status', $maxAttempts <= 0
                        ? 'unlimited'
                        : ($regularCount <= 0
                            ? 'unused'
                            : ($regularCount >= $maxAttempts ? 'exhausted' : 'partial')));
                }

                $courseTest->setAttribute('best_attempt', $bestAttempt ? [
                    'id' => $bestAttempt->id,
                    'score' => (int) $bestAttempt->score,
                    'passed' => (bool) $bestAttempt->passed,
                    'submitted_at' => optional($bestAttempt->submitted_at)->toIso8601String(),
                ] : null);

                return $courseTest;
            })->values();
        }

        $hasActiveRemedial = false;
        $remedialDeadline = null;
        $tz = 'Asia/Jakarta';
        $now = now($tz);

        foreach ($courseTests as $ct) {
            if ($ct->is_remedial_mode && $ct->remedial_status === 'active') {
                $hasActiveRemedial = true;
                $remEnd = $ct->remedial_end_date ? Carbon::parse($ct->remedial_end_date, $tz) : null;
                if ($remEnd) {
                    if (!$remedialDeadline || $remEnd->greaterThan($remedialDeadline)) {
                        $remedialDeadline = $remEnd;
                    }
                }
            }
        }

        $course->setAttribute('has_active_remedial', $hasActiveRemedial);
        $course->setAttribute('remedial_deadline', $remedialDeadline ? $remedialDeadline->toIso8601String() : null);

        return Inertia::render('Course/DetailCourse', [
            'course' => $course,
            'pivot' => $pivot,
            'teacher' => $course->user,
            'courseSchedules' => $course->courseSchedules,
            'courseTests' => $courseTests,
            'active_course_id' => $active_course_id,
            'fakturs' => $fakturs,
            'returs' => $returs,
            'others' => $others,
            'returOthers' => $returOthers,
            'bupots' => $bupots,
            'spts' => $spts,
            'courseResults' => $courseResults,
        ]);
    }

    public function courseModules($courseId)
    {
        $user = Auth::user();
        $course = Course::with(['modules' => function ($query) {
            $query->orderBy('created_at');
        }, 'user'])->findOrFail($courseId);

        $canAccess = false;

        if (Auth::user()->role === 'pengajar' && $course->teacher_id === Auth::id()) {
            $canAccess = true;
        } elseif (Auth::user()->role === 'pengguna') {
            $participant = CourseUser::where('course_id', $courseId)
                ->where('user_id', Auth::id())
                ->first();
            if ($participant) {
                $canAccess = true;
            }
        } elseif (Auth::user()->role === 'admin') {
            $canAccess = true;
        }

        if (!$canAccess) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses ke kelas ini');
        }

        return Inertia::render('Course/Modules', [
            'teacher' => $course->user,
            'course' => $course,
            'modules' => $course->modules,
            'canManage' => Auth::user()->role === 'pengajar' && $course->teacher_id === Auth::id()
        ]);
    }

    public function courseTestDetail($courseId, $courseTestId)
    {
        $course = Course::with('user')->findOrFail($courseId);

        $participant = CourseUser::where('course_id', $course->id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$participant) {
            return redirect()->route('courses.detail', $course->id)
                ->with('error', 'Anda tidak memiliki akses ke ujian kelas ini.');
        }

        $courseTest = CourseTest::with('questionBank')
            ->where('course_id', $course->id)
            ->findOrFail($courseTestId);

        $tz = 'Asia/Jakarta';
        $now = now($tz);

        $courseEnd = $course->end_date ? Carbon::parse($course->end_date, $tz) : null;
        $remedialStart = $courseEnd ? $courseEnd->copy()->addDay()->startOfDay() : null;
        $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;

        $isRemedialActive = false;
        $isRemedialEligible = false;

        $attempts = CourseTestAttempt::where('user_id', Auth::id())
            ->where('course_test_id', $courseTest->id)
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->get();

        $passingScore = (int) ($courseTest->passing_score ?? 70);
        $bestRegularScore = $attempts->where('test_type', 'exam')->max('score');
        $isFailedRegular = is_null($bestRegularScore) || $bestRegularScore < $passingScore;

        if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
            if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                $isRemedialActive = true;
            }
            $isRemedialEligible = $isFailedRegular;
        }

        $attemptHistory = $attempts
            ->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'score' => (int) $attempt->score,
                    'passed' => (bool) $attempt->passed,
                    'submitted_at' => optional($attempt->submitted_at)->toIso8601String(),
                    'test_type' => $attempt->test_type,
                ];
            });

        $lastAttempt = $attempts->first();

        if ($isRemedialActive && $isRemedialEligible) {
            $bestRemedialScore = $attempts->where('test_type', 'remedial')->max('score') ?? 0;
            $hasPassed = ($bestRegularScore >= $passingScore) || ($bestRemedialScore >= $passingScore);
            
            $canAttempt = !$hasPassed;
            $maxAttempts = 0;
            $attemptsRemaining = $hasPassed ? 0 : null;
            $attemptsUsed = $attempts->count();
        } else {
            $regularAttemptsCount = $attempts->where('test_type', 'exam')->count();
            $maxAttempts = max(0, (int) ($courseTest->max_attempts ?? 0));
            $attemptsRemaining = $maxAttempts > 0
                ? max($maxAttempts - $regularAttemptsCount, 0)
                : null;
            $canAttempt = $attemptsRemaining === null ? true : $attemptsRemaining > 0;
            $attemptsUsed = $regularAttemptsCount;
        }

        $activeCourseTestId = $this->resolveActiveCourseTestId(Auth::id());

        $rawStart = $courseTest->getRawOriginal('start_date');
        $rawEnd   = $courseTest->getRawOriginal('end_date');
        $ctStart  = $rawStart ? $this->parseScheduleDateTime($rawStart, $tz) : null;
        $ctEnd    = $rawEnd   ? $this->parseScheduleDateTime($rawEnd,   $tz) : null;

        if ($isRemedialActive && $isRemedialEligible) {
            $courseTestStatus = 'remedial_active';
        } elseif ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
            if ($isRemedialEligible) {
                if ($remedialEnd && $now->gt($remedialEnd)) {
                    $courseTestStatus = 'remedial_finished';
                } else {
                    $courseTestStatus = 'remedial_active';
                }
            } else {
                $courseTestStatus = 'remedial_not_eligible';
            }
        } else {
            if (!$ctStart && !$ctEnd) {
                $courseTestStatus = 'ongoing';
            } elseif ($ctStart && $now->lt($ctStart)) {
                $courseTestStatus = 'upcoming';
            } elseif ($ctEnd && $now->gt($ctEnd)) {
                $courseTestStatus = 'finished';
            } else {
                $courseTestStatus = 'ongoing';
            }
        }

        return Inertia::render('Course/CourseTest/Detail', [
            'course' => $course,
            'courseTest' => $courseTest,
            'teacher' => $course->user,
            'attemptHistory' => $attemptHistory,
            'lastAttempt' => $lastAttempt ? [
                'id' => $lastAttempt->id,
                'score' => (int) $lastAttempt->score,
                'passed' => (bool) $lastAttempt->passed,
                'submitted_at' => optional($lastAttempt->submitted_at)->toIso8601String(),
                'test_type' => $lastAttempt->test_type,
            ] : null,
            'activeCourseTestId' => $activeCourseTestId,
            'attemptsUsed' => $attemptsUsed,
            'maxAttempts' => $maxAttempts,
            'attemptsRemaining' => $attemptsRemaining,
            'canAttempt' => $canAttempt,
            'courseTestStatus' => $courseTestStatus,
            'isRemedialMode' => $isRemedialActive && $isRemedialEligible,
        ]);
    }

    private function resolveActiveCourseTestId(string $userId): ?string
    {
        $activeCourseTestId = session('active_course_test_id');

        if (!$activeCourseTestId) {
            return null;
        }

        $activeCourseTest = CourseTest::select(['id', 'end_date'])->find($activeCourseTestId);
        $hasOpenAttempt = CourseTestAttempt::where('user_id', $userId)
            ->where('course_test_id', $activeCourseTestId)
            ->whereNull('submitted_at')
            ->exists();

        $isClosed = false;
        if ($activeCourseTest) {
            $endDate = $this->parseScheduleDateTime(
                $activeCourseTest->getRawOriginal('end_date'),
                'Asia/Jakarta'
            );

            if ($endDate) {
                $isClosed = now('Asia/Jakarta')->greaterThanOrEqualTo($endDate);
            }
        }

        if (!$activeCourseTest || !$hasOpenAttempt || $isClosed) {
            session()->forget('active_course_test_id');
            return null;
        }

        return $activeCourseTestId;
    }

    private function parseScheduleDateTime(?string $value, string $timezone): ?Carbon
    {
        if (empty($value)) {
            return null;
        }

        $normalized = trim((string) $value);

        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/', $normalized, $matched) === 1) {
            return Carbon::create(
                (int) $matched[1],
                (int) $matched[2],
                (int) $matched[3],
                (int) $matched[4],
                (int) $matched[5],
                (int) ($matched[6] ?? 0),
                $timezone,
            );
        }

        try {
            return Carbon::parse($normalized, $timezone);
        } catch (\Throwable $exception) {
            return null;
        }
    }

    public function startWorking($id)
    {
        $course = Course::findOrFail($id);

        session(['active_course_id' => $course->id]);

        return back()->with('success', 'Kelas aktif: ' . $course->name);
    }

    public function stopWorking()
    {
        session()->forget('active_course_id');

        return redirect()->route('courses')->with('success', 'Kelas berhasil dihentikan!');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $pivot = CourseUser::where('course_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($pivot) {
            $pivot->delete();
            return redirect()->route('courses')->with('success', 'Berhasil keluar dari kelas.');
        }
        return back()->with('error', 'Anda tidak terdaftar di kelas ini.');
    }
}
