<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseModuleController extends Controller
{
    public function index($courseId)
    {
        $course = Course::with(['modules' => function ($query) {
            $query->orderBy('created_at');
        }])->findOrFail($courseId);

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

        return Inertia::render('Teacher/Course/Modules/Modules', [
            'course' => $course,
            'modules' => $course->modules,
            'canManage' => Auth::user()->role === 'pengajar' && $course->teacher_id === Auth::id()
        ]);
    }

    public function create($courseId)
    {
        $course = Course::findOrFail($courseId);

        if (Auth::user()->role !== 'pengajar' || $course->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Teacher/Course/Modules/CreateModule', [
            'course' => $course
        ]);
    }

    public function store(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);

        if (Auth::user()->role !== 'pengajar' || $course->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:file,link',
            'file' => 'required_if:type,file|file|mimes:pdf,doc,docx,ppt,pptx|max:20480',
            'link_url' => 'required_if:type,link|url',
        ]);

        $moduleData = [
            'course_id' => $courseId,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
        ];

        if ($validated['type'] === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('course-modules', $filename, 'public');

            $moduleData['file_path'] = $path;
            $moduleData['original_filename'] = $file->getClientOriginalName();
        } elseif ($validated['type'] === 'link') {
            $moduleData['link_url'] = $validated['link_url'];
        }

        CourseModule::create($moduleData);

        return redirect()->route('course.modules.index', $courseId)->with('success', 'Modul berhasil ditambahkan');
    }

    public function show($moduleId)
    {
        $module = CourseModule::with('course')->findOrFail($moduleId);

        $canAccess = $this->checkModuleAccess($module->course);

        if (!$canAccess) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Teacher/Course/Modules/Show', [
            'module' => $module,
            'course' => $module->course
        ]);
    }

    public function edit($courseId, $moduleId)
    {
        $module = CourseModule::with('course')->findOrFail($moduleId);

        if (Auth::user()->role !== 'pengajar' || $module->course->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Teacher/Course/Modules/EditModule', [
            'module' => $module,
            'course' => $module->course
        ]);
    }

    public function update(Request $request, $courseId, $moduleId)
    {
        $module = CourseModule::with('course')->findOrFail($moduleId);

        if (Auth::user()->role !== 'pengajar' || $module->course->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:file,link',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:20480',
            'link_url' => 'required_if:type,link|url',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
        ];

        if ($validated['type'] === 'file') {
            if ($request->hasFile('file')) {
                if ($module->isFile() && $module->file_path) {
                    Storage::disk('public')->delete($module->file_path);
                }

                $file = $request->file('file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('course-modules', $filename, 'public');

                $updateData['file_path'] = $path;
                $updateData['original_filename'] = $file->getClientOriginalName();
                $updateData['link_url'] = null;
            }
        } elseif ($validated['type'] === 'link') {
            if ($module->isFile() && $module->file_path) {
                Storage::disk('public')->delete($module->file_path);
            }

            $updateData['link_url'] = $validated['link_url'];
            $updateData['file_path'] = null;
            $updateData['original_filename'] = null;
        }

        $module->update($updateData);

        return redirect()->route('course.modules.index', $courseId)->with('success', 'Modul berhasil diperbarui');
    }

    public function destroy($courseId, $moduleId)
    {
        $module = CourseModule::with('course')->findOrFail($moduleId);

        if (Auth::user()->role !== 'pengajar' || $module->course->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        if ($module->isFile() && $module->file_path) {
            Storage::disk('public')->delete($module->file_path);
        }

        $module->delete();

        return back()->with('success', 'Modul berhasil dihapus');
    }

    public function download($moduleId)
    {
        $module = CourseModule::with('course')->findOrFail($moduleId);

        if (!$this->checkModuleAccess($module->course)) {
            abort(403, 'Unauthorized');
        }

        if (!$module->isFile() || !$module->hasFile()) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->download(
            Storage::disk('public')->path($module->file_path),
            $module->original_filename
        );
    }

    public function view($moduleId)
    {
        $module = CourseModule::with('course')->findOrFail($moduleId);

        if (!$this->checkModuleAccess($module->course)) {
            abort(403, 'Unauthorized');
        }

        if (!$module->isFile() || !$module->hasFile()) {
            abort(404, 'File tidak ditemukan');
        }

        $filePath = Storage::disk('public')->path($module->file_path);
        $fileExtension = pathinfo($module->file_path, PATHINFO_EXTENSION);

        if (strtolower($fileExtension) === 'pdf') {
            return response()->file($filePath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $module->original_filename . '"'
            ]);
        }

        return $this->download($moduleId);
    }

    private function checkModuleAccess($course)
    {
        if (Auth::user()->role === 'pengajar' && $course->teacher_id === Auth::id()) {
            return true;
        }

        if (Auth::user()->role === 'pengguna') {
            $participant = CourseUser::where('course_id', $course->id)
                ->where('user_id', Auth::id())
                ->first();
            return $participant !== null;
        }

        if (Auth::user()->role === 'admin') {
            return true;
        }

        return false;
    }
}
