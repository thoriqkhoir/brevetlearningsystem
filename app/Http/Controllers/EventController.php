<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/DaftarEvent', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        $eventCount = Event::count();

        return Inertia::render('Admin/FormCreateEvent', [
            'eventCount' => $eventCount,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
        ]);

        try {
            $event = new Event();
            $event->code = $validated['code'];
            $event->name = $validated['name'];
            $event->save();

            return redirect()->route('admin.events')->with('success', 'Event berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->route('admin.events')->with('success', 'Event gagal ditambahkan.');
        }
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id);

        return Inertia::render('Admin/FormEditEvent', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
        ]);

        try {
            $event = Event::findOrFail($id);
            $event->code = $validated['code'];
            $event->name = $validated['name'];
            $event->save();

            return redirect()->route('admin.events')->with('success', 'Event berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('admin.events')->with('success', 'Event gagal diperbarui.');
        }
    }

    public function destroy($id)
    {
        $user = Event::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.events')->with('success', 'Event berhasil dihapus.');
    }
}
