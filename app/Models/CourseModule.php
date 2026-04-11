<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CourseModule extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function isFile()
    {
        return $this->type === 'file';
    }

    public function isLink()
    {
        return $this->type === 'link';
    }

    public function hasFile()
    {
        return $this->isFile() && $this->file_path && Storage::disk('public')->exists($this->file_path);
    }

    public function getDownloadUrlAttribute()
    {
        if ($this->isFile()) {
            return route('course.module.download', $this->id);
        }
        return $this->link_url;
    }

    public function getViewUrlAttribute()
    {
        if ($this->isFile()) {
            return route('course.module.view', $this->id);
        }
        return $this->link_url;
    }
}
