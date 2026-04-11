<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function billingType()
    {
        return $this->belongsTo(MasterBillingType::class, 'billing_type_id');
    }

    public function billingPayment()
    {
        return $this->belongsTo(MasterBillingPayment::class, 'billing_payment_id');
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class, 'billing_id');
    }

    public function spt()
    {
        return $this->belongsTo(Spt::class, 'spt_id');
    }

    /**
     * Course results linked to this billing (via billing_id on course_results)
     */
    public function courseResults()
    {
        return $this->hasMany(CourseResult::class, 'billing_id');
    }

    /**
     * Scope by billing form id
     */
    public function scopeByBillingForm($query, $billingFormId)
    {
        return $query->where('billing_form_id', $billingFormId);
    }

    /**
     * Scope billings that belong to a specific course through course_results -> course_user
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->whereHas('courseResults.courseUser', function ($q) use ($courseId) {
            $q->where('course_id', $courseId);
        });
    }

    /**
     * Ensure we only pull billings for a user AND course (optionally including those without linkage when desired)
     */
    public function scopeForUserAndCourse($query, $userId, $courseId, $includeUnlinked = false)
    {
        return $query->where('user_id', $userId)
            ->where(function ($qq) use ($courseId, $includeUnlinked) {
                $qq->whereHas('courseResults.courseUser', function ($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                });
                if ($includeUnlinked) {
                    $qq->orWhereDoesntHave('courseResults'); // billings global yang belum di-assign
                }
            });
    }

    /**
     * Smart scope: ambil billing milik user & course.
     *  - Billing yang sudah ter-link course_results (normal)
     *  - Billing yang belum ter-link tetapi punya SPT yang sudah ter-link ke course aktif
     *    (sehingga aman diasosiasikan ke course itu – nanti bisa kita auto-backfill).
     *  Deposit (billing tanpa spt_id) yang belum ter-link TIDAK diambil agar tidak bocor.
     */
    public function scopeForUserAndCourseSmart($query, $userId, $courseId)
    {
        return $query->where('user_id', $userId)
            ->where(function ($qq) use ($courseId) {
                // 1. Billing sudah ter-link ke course melalui course_results
                $qq->whereHas('courseResults.courseUser', function ($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                })
                    // 2. ATAU billing belum ter-link (doesntHave courseResults), tapi punya SPT yang sudah ter-link ke course tersebut
                    ->orWhere(function ($q2) use ($courseId) {
                        $q2->doesntHave('courseResults')
                            ->whereNotNull('spt_id')
                            ->whereHas('spt.courseResults.courseUser', function ($qs) use ($courseId) {
                                $qs->where('course_id', $courseId);
                            });
                    });
            });
    }
}
