import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    Clock,
    Download,
    FileCheck,
    FileText,
    GraduationCap,
    Lock,
    NotebookPen,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function parseLocalDate(value?: string | null) {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (!match) return null;
    return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6] ?? 0)
    );
}

function formatLocalDateTime(value?: string | null) {
    const date = parseLocalDate(value);
    if (!date) return value || "-";
    
    const day = date.getDate();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${day} ${month} ${year}, ${hours}.${minutes} WIB`;
}

function getCourseTestStatusDisplay(serverStatus: string) {
    switch (serverStatus) {
        case 'upcoming':
        case 'remedial_upcoming':
            return {
                label: "Belum Mulai",
                color: "text-slate-700 bg-slate-100 border border-slate-200",
            };
        case 'finished':
        case 'remedial_finished':
            return {
                label: "Selesai",
                color: "text-rose-700 bg-rose-100 border border-rose-200",
            };
        case 'remedial_active':
            return {
                label: "Remedial Aktif",
                color: "text-rose-700 bg-rose-100 border border-rose-200",
            };
        case 'remedial_not_eligible':
            return {
                label: "Sudah Lulus",
                color: "text-emerald-700 bg-emerald-100 border border-emerald-200",
            };
        case 'ongoing':
        default:
            return {
                label: "Sedang Berlangsung",
                color: "text-emerald-700 bg-emerald-100 border border-emerald-200",
            };
    }
}

export default function CourseTestDetail({
    course,
    courseTest,
    teacher,
    submission = null,
    courseSubmissions = [],
    isSubmissionApproved: initialIsSubmissionApproved = null,
    attemptHistory = [],
    lastAttempt = null,
    activeCourseTestId = null,
    attemptsUsed = 0,
    maxAttempts = 0,
    attemptsRemaining = null,
    canAttempt = true,
    courseTestStatus = 'ongoing',
    isRemedialMode = false,
}: any) {
    const { flash }: any = usePage().props;
    const status = getCourseTestStatusDisplay(courseTestStatus);
    const isClosed = courseTestStatus === 'finished' || courseTestStatus === 'remedial_finished';
    const notStarted = courseTestStatus === 'upcoming' || courseTestStatus === 'remedial_upcoming';
    const isNotEligible = courseTestStatus === 'remedial_not_eligible';
    const isActive = activeCourseTestId === courseTest?.id;
    const hasOtherActive =
        activeCourseTestId && activeCourseTestId !== courseTest?.id;
    const isAttemptLimitReached = !canAttempt;
    const isUnlimitedAttempts = isRemedialMode || Number(maxAttempts ?? 0) <= 0;
    const passingScore = Number(courseTest?.passing_score ?? 70);

    const isSubmissionRequired = Boolean(courseTest?.requires_submission);
    const isAllSubmissionsRequired = Boolean(
        courseTest?.is_all_submissions_required ||
        (!courseTest?.course_submission_id && courseSubmissions.length > 0)
    );

    const approvedSubmissionsCount = courseSubmissions.filter(
        (cs: any) => cs.user_submission?.status === 'approved'
    ).length;

    const allSubmissionsApproved = courseSubmissions.length > 0 &&
        approvedSubmissionsCount === courseSubmissions.length;

    const isSubmissionApproved = initialIsSubmissionApproved !== null
        ? Boolean(initialIsSubmissionApproved)
        : (isAllSubmissionsRequired
            ? allSubmissionsApproved
            : Boolean(courseTest?.is_submission_approved || submission?.status === 'approved'));

    const isSubmissionPending = !isSubmissionApproved && (
        isAllSubmissionsRequired
            ? courseSubmissions.some((cs: any) => cs.user_submission?.status === 'pending_review')
            : submission?.status === 'pending_review'
    );
    const isSubmissionRejected = !isSubmissionApproved && (
        isAllSubmissionsRequired
            ? courseSubmissions.some((cs: any) => cs.user_submission?.status === 'rejected')
            : submission?.status === 'rejected'
    );
    const isExamLockedBySubmission = isSubmissionRequired && !isSubmissionApproved;
    const requiredTaskTitle = isAllSubmissionsRequired
        ? `Semua Tugas di Kelas Ini (${courseSubmissions.length} Tugas)`
        : (courseTest?.course_submission?.title || submission?.course_submission?.title || "Tugas Kelas");

    const attemptsText = isRemedialMode
        ? `Tidak terbatas (hingga nilai >= ${passingScore})`
        : (isUnlimitedAttempts
            ? "Tidak terbatas"
            : `${attemptsRemaining ?? 0} / ${maxAttempts}`);
    const showScore = courseTest?.show_score ?? true;
    const bestAttempt =
        attemptHistory.length > 0
            ? [...attemptHistory].sort((a: any, b: any) => {
                  const scoreDiff =
                      Number(b?.score ?? 0) - Number(a?.score ?? 0);
                  if (scoreDiff !== 0) return scoreDiff;

                  const bTime = b?.submitted_at
                      ? new Date(b.submitted_at).getTime()
                      : 0;
                  const aTime = a?.submitted_at
                      ? new Date(a.submitted_at).getTime()
                      : 0;

                  return bTime - aTime;
              })[0]
            : null;

    const bestAttemptLabel = bestAttempt?.passed ? "Lulus" : "Tidak lulus";

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    return (
        <AuthenticatedLayout>
            <Head title={`Ujian Kelas - ${courseTest?.title ?? "Ujian"}`} />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link href={route("courses.detail", course.id)}>
                                    {course?.name || "Detail Kelas"}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {courseTest?.title || "Ujian Kelas"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-primary">
                                Ujian Kelas: {courseTest?.title}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Detail ini termasuk dalam kelas{" "}
                                <span className="font-semibold text-primary">
                                    {course?.name || "-"}
                                </span>
                                .
                            </p>
                        </div>

                        <Button variant="outline" asChild>
                            <Link href={route("courses.detail", course.id)}>
                                Kembali ke Detail Kelas
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow space-y-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                                >
                                    {status.label}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold">
                                    <GraduationCap className="mr-1 h-3.5 w-3.5" />
                                    Bagian dari kelas {course?.name || "-"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Pengajar:{" "}
                                    <span className="font-medium text-gray-700">
                                        {teacher?.name ?? "-"}
                                    </span>
                                </span>
                            </div>

                            <div>
                                {bestAttempt ? (
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                            bestAttempt.passed
                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                : "border-rose-200 bg-rose-100 text-rose-700"
                                        }`}
                                    >
                                        {showScore ? (
                                            <>
                                                Nilai Terbaik:{" "}
                                                {bestAttempt.score} ({" "}
                                                {bestAttemptLabel})
                                            </>
                                        ) : (
                                            <>Status: {bestAttemptLabel}</>
                                        )}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {showScore
                                            ? "Nilai Terbaik: -"
                                            : "Status: -"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm md:text-base">
                            {courseTest?.description ||
                                "Tidak ada deskripsi ujian."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border p-3 bg-slate-50/70">
                                <div className="text-gray-500">Kelas</div>
                                <div className="font-semibold text-gray-800">
                                    {course?.name || "-"}
                                </div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-gray-500">
                                    Kesempatan Mengerjakan
                                </div>
                                <div className="font-semibold text-gray-800">
                                    {attemptsText}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Sudah digunakan: {attemptsUsed}
                                </div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-gray-500">Durasi</div>
                                <div className="font-semibold text-gray-800">
                                    {courseTest?.duration
                                        ? `${courseTest.duration} menit`
                                        : "-"}
                                </div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-gray-500">
                                    {showScore ? "Nilai Terbaik" : "Status"}
                                </div>
                                <div className="font-semibold text-gray-800">
                                    {bestAttempt
                                        ? showScore
                                            ? `${bestAttempt.score} (${bestAttemptLabel})`
                                            : bestAttemptLabel
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-dashed bg-slate-50/70 p-3 text-sm text-gray-700">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <CalendarClock size={14} />
                                <span className="font-medium">
                                    Mulai Ujian:
                                </span>
                                {formatLocalDateTime(courseTest?.start_date)}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <CalendarClock size={14} />
                                <span className="font-medium">
                                    Selesai Ujian:
                                </span>
                                {formatLocalDateTime(courseTest?.end_date)}
                            </div>
                        </div>

                        {isSubmissionRequired && (
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="h-5 w-5 text-indigo-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                                                Persyaratan Akses Ujian: Pengiriman Tugas (Submission)
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Tugas yang diwajibkan: <strong className="text-primary">{requiredTaskTitle}</strong>
                                                {isAllSubmissionsRequired && (
                                                    <span className="ml-1 text-slate-500 font-normal">
                                                        (Wajib ACC seluruhnya)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {isAllSubmissionsRequired ? (
                                            isSubmissionApproved ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                    Semua Tugas Di-ACC ({approvedSubmissionsCount}/{courseSubmissions.length})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                                                    <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                                    Belum Lengkap ({approvedSubmissionsCount}/{courseSubmissions.length} Di-ACC)
                                                </span>
                                            )
                                        ) : (
                                            <>
                                                {!submission && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                                                        <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                                                        Belum Mengumpulkan
                                                    </span>
                                                )}
                                                {isSubmissionPending && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                                                        <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                                        Menunggu Review (ACC)
                                                    </span>
                                                )}
                                                {isSubmissionApproved && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                        Disetujui (ACC)
                                                    </span>
                                                )}
                                                {isSubmissionRejected && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 border border-rose-200">
                                                        <XCircle className="h-3.5 w-3.5 text-rose-500" />
                                                        Perlu Perbaikan (Ditolak)
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isAllSubmissionsRequired && courseSubmissions.length > 0 && (
                                    <div className="rounded-lg border bg-slate-50/60 p-3.5 space-y-2">
                                        <div className="flex items-center justify-between text-xs text-gray-700 font-semibold border-b pb-2">
                                            <span>Daftar Tugas yang Wajib Di-ACC ({courseSubmissions.length} Tugas)</span>
                                            <span className={isSubmissionApproved ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
                                                {approvedSubmissionsCount} dari {courseSubmissions.length} Tugas Telah Di-ACC
                                            </span>
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            {courseSubmissions.map((cs: any, idx: number) => {
                                                const userSub = cs.user_submission;
                                                const isAcc = userSub?.status === 'approved';
                                                const isPending = userSub?.status === 'pending_review';
                                                const isRejected = userSub?.status === 'rejected';

                                                return (
                                                    <div
                                                        key={cs.id}
                                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border text-xs ${
                                                            isAcc
                                                                ? "bg-emerald-50/40 border-emerald-200"
                                                                : isPending
                                                                ? "bg-amber-50/40 border-amber-200"
                                                                : isRejected
                                                                ? "bg-rose-50/40 border-rose-200"
                                                                : "bg-white border-slate-200"
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <span className="font-semibold text-gray-500">{idx + 1}.</span>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{cs.title}</p>
                                                                {cs.deadline && (
                                                                    <p className="text-[11px] text-gray-500">
                                                                        Batas Waktu: {formatLocalDateTime(cs.deadline)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                                            {isAcc ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-300">
                                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                                    Disetujui (ACC)
                                                                </span>
                                                            ) : isPending ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-300">
                                                                    <Clock className="h-3 w-3 text-amber-600 animate-pulse" />
                                                                    Menunggu Review (ACC)
                                                                </span>
                                                            ) : isRejected ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-300">
                                                                    <XCircle className="h-3 w-3 text-rose-600" />
                                                                    Ditolak (Perlu Perbaikan)
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-300">
                                                                    <AlertCircle className="h-3 w-3 text-slate-500" />
                                                                    Belum Mengumpulkan
                                                                </span>
                                                            )}
                                                            {/* {userSub?.id && (
                                                                <a
                                                                    href={route("submissions.download", userSub.id)}
                                                                    className="inline-flex items-center gap-1 rounded border bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    <Download className="h-3 w-3" />
                                                                    Berkas
                                                                </a>
                                                            )} */}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {courseTest?.submission_instructions && (
                                    <div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-3.5 text-sm text-indigo-900">
                                        <p className="font-semibold text-xs uppercase tracking-wider text-indigo-700 mb-1">
                                            Instruksi Pengajar:
                                        </p>
                                        <div className="whitespace-pre-wrap text-xs md:text-sm text-indigo-800">
                                            {courseTest.submission_instructions}
                                        </div>
                                    </div>
                                )}

                                {/* {isSubmissionApproved && (
                                    <div className="rounded-lg bg-emerald-50/60 border border-emerald-200 p-4 space-y-2">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-emerald-900 flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                    {isAllSubmissionsRequired
                                                        ? `Semua Tugas Persyaratan (${courseSubmissions.length} Tugas) Telah Di-ACC!`
                                                        : `Tugas Persyaratan Telah Di-ACC!`}
                                                </p>
                                                <p className="text-xs text-emerald-700 mt-0.5">
                                                    {isAllSubmissionsRequired
                                                        ? `Seluruh tugas submission di kelas ini telah disetujui (ACC) oleh pengajar. Akses pengerjaan ujian telah terbuka.`
                                                        : `Tugas ${requiredTaskTitle} telah disetujui. Akses pengerjaan ujian telah terbuka.`}
                                                </p>
                                            </div>
                                            {!isAllSubmissionsRequired && submission?.id && (
                                                <a
                                                    href={route("submissions.download", submission.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50 shadow-xs transition"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    Berkas Saya ({submission.original_filename})
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )} */}

                                {!isSubmissionApproved && (
                                    <div className="rounded-lg bg-amber-50/60 border border-amber-200 p-4 space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-amber-600" />
                                                {isAllSubmissionsRequired
                                                    ? `Sebagian / Seluruh Tugas Belum Di-ACC Pengajar`
                                                    : isSubmissionPending
                                                    ? `Tugas Masih Menunggu Review (ACC) Pengajar`
                                                    : isSubmissionRejected
                                                    ? `Tugas Perlu Perbaikan (Ditolak)`
                                                    : `Tugas Belum Dikirimkan`}
                                            </p>
                                            <p className="text-xs text-amber-700 mt-0.5">
                                                {isAllSubmissionsRequired
                                                    ? `Ujian ini mewajibkan seluruh tugas (${courseSubmissions.length} tugas) disetujui (ACC) oleh pengajar. Saat ini baru ${approvedSubmissionsCount} dari ${courseSubmissions.length} tugas yang telah disetujui.`
                                                    : `Tugas ${requiredTaskTitle} belum disetujui (ACC). Ujian akan dapat dimulai setelah tugas disetujui.`}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button size="sm" variant="outline" asChild className="text-xs text-amber-800 border-amber-300 bg-white hover:bg-amber-50">
                                                <Link href={route("courses.detail", course.id)}>
                                                    Lihat & Kerjakan Tugas di Halaman Kelas
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-1">
                             <Button
                                disabled={
                                    (courseTestStatus !== 'ongoing' && courseTestStatus !== 'remedial_active') ||
                                    Boolean(hasOtherActive) ||
                                    isAttemptLimitReached ||
                                    isNotEligible ||
                                    isExamLockedBySubmission
                                }
                                onClick={() => {
                                    router.post(
                                        route("courses.courseTests.start", [
                                            course.id,
                                            courseTest.id,
                                        ]),
                                    );
                                }}
                            >
                                <NotebookPen className="mr-2 h-4 w-4" />
                                {isActive
                                    ? "Lanjutkan Ujian"
                                    : lastAttempt
                                      ? (isRemedialMode ? "Kerjakan Remedial" : "Ulangi Mengerjakan")
                                      : "Mulai Ujian"}
                            </Button>
                            {isExamLockedBySubmission && (
                                <p className="mt-2 text-xs font-medium text-amber-700 flex items-center gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                    {isAllSubmissionsRequired
                                        ? `Ujian ini memerlukan persetujuan (ACC) seluruh tugas di kelas ini (${approvedSubmissionsCount}/${courseSubmissions.length} disetujui). Silakan lengkapi di halaman kelas.`
                                        : !submission
                                        ? `Ujian ini memerlukan persetujuan (ACC) tugas "${requiredTaskTitle}". Silakan kumpulkan tugas pada halaman kelas terlebih dahulu.`
                                        : isSubmissionPending
                                        ? `Tugas "${requiredTaskTitle}" sedang menunggu review (ACC) pengajar. Ujian akan terbuka setelah disetujui.`
                                        : `Tugas "${requiredTaskTitle}" belum disetujui (Ditolak). Silakan perbaiki dan kirimkan revisi pada halaman kelas.`}
                                </p>
                            )}
                            {hasOtherActive && (
                                <p className="mt-2 text-xs text-red-600">
                                    Anda memiliki ujian kelas aktif lain.
                                    Selesaikan terlebih dahulu sebelum memulai
                                    ujian ini.
                                </p>
                            )}
                            {!hasOtherActive && notStarted && (
                                <p className="mt-2 text-xs text-red-600">
                                    {isRemedialMode ? "Remedial belum dimulai." : "Ujian kelas belum mulai."}
                                </p>
                            )}
                            {!hasOtherActive && isClosed && (
                                <p className="mt-2 text-xs text-red-600">
                                    {isRemedialMode ? "Remedial telah ditutup." : "Ujian kelas sudah ditutup."}
                                </p>
                            )}
                            {isNotEligible && (
                                <p className="mt-2 text-xs text-emerald-600 font-semibold">
                                    Anda telah lulus ujian kelas ini (nilai &gt;= {passingScore}).
                                </p>
                            )}
                            {isAttemptLimitReached && !isNotEligible && (
                                <p className="mt-2 text-xs text-red-600">
                                    {isRemedialMode
                                        ? `Anda sudah lulus ujian remedial ini (nilai >= ${passingScore}).`
                                        : "Batas kesempatan ujian sudah habis."}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                {isRemedialMode
                                    ? `Anda dapat mengerjakan remedial berulang kali selama masa remedial berlangsung dan Anda belum mencapai nilai kelulusan (>= ${passingScore}).`
                                    : "Anda dapat mengerjakan ulang selama ujian masih berlangsung dan kuota pengerjaan masih tersedia."}
                            </p>
                        </div>

                        {attemptHistory.length > 0 && (
                            <div className="rounded-lg border bg-white p-3">
                                <p className="text-sm font-semibold text-slate-800 mb-2">
                                    Riwayat Sesi Ujian
                                </p>
                                <div className="space-y-2">
                                    {attemptHistory.map(
                                        (attempt: any, idx: number) => (
                                            <div
                                                key={attempt.id}
                                                className="flex flex-col gap-2 rounded-md border p-2.5 md:flex-row md:items-center md:justify-between"
                                            >
                                                <div className="text-sm text-slate-700">
                                                    <span className="font-medium">
                                                        Sesi{" "}
                                                        {attemptHistory.length -
                                                            idx}
                                                    </span>
                                                    <span className="mx-2 text-slate-400">
                                                        •
                                                    </span>
                                                    {showScore ? (
                                                        <>
                                                            Skor:{" "}
                                                            {attempt.score}
                                                            <span className="mx-2 text-slate-400">
                                                                •
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>Status:</>
                                                    )}
                                                    <span
                                                        className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                                                            attempt.passed
                                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                                : "border-rose-200 bg-rose-100 text-rose-700"
                                                        }`}
                                                    >
                                                        {attempt.passed
                                                            ? "Lulus"
                                                            : "Tidak lulus"}
                                                    </span>
                                                    {attempt.submitted_at && (
                                                        <>
                                                            <span className="mx-2 text-slate-400">
                                                                •
                                                            </span>
                                                            {formatLocalDateTime(attempt.submitted_at)}
                                                        </>
                                                    )}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "courses.courseTests.result",
                                                            [
                                                                course.id,
                                                                courseTest.id,
                                                                attempt.id,
                                                            ],
                                                        )}
                                                    >
                                                        {showScore
                                                            ? "Lihat Hasil"
                                                            : "Lihat Status"}
                                                    </Link>
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
