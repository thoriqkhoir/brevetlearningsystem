<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    protected $table = 'ledger';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function billingType()
    {
        return $this->belongsTo(MasterBillingType::class, 'billing_type_id');
    }
    public function billing()
    {
        return $this->belongsTo(Billing::class, 'billing_id', 'id');
    }

    public function courseUsers()
    {
        return $this->hasMany(CourseUser::class, 'ledger_id');
    }

    public function courseResults()
    {
        return $this->hasMany(CourseResult::class, 'ledger_id'); 
    }

    /**
     * Scope ledger entries for a specific course through course_results -> course_user
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where(function ($q) use ($courseId) {
            // 1) Ledger langsung ter-link ke course melalui course_results
            $q->whereHas('courseResults.courseUser', function ($qq) use ($courseId) {
                $qq->where('course_id', $courseId);
            })
            // 2) ATAU ledger terasosiasi lewat billing yang sudah ter-link ke course
            ->orWhereHas('billing.courseResults.courseUser', function ($qq) use ($courseId) {
                $qq->where('course_id', $courseId);
            });
        });
    }

}
