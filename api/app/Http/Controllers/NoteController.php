<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use App\Http\Response\ResponseJSON;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = Note::orderBy('last_edited_at', 'desc')->get();
        return ResponseJSON::success('Notes retrieved successfully', $notes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'title' => 'nullable|string',
            'body' => 'nullable|string',
            'is_favorite' => 'nullable|boolean',
            'is_archived' => 'nullable|boolean',
        ]);

        $note = Note::create($validated);

        return ResponseJSON::success('Note created successfully', $note);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        return ResponseJSON::success('Note retrieved successfully', $note);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'body' => 'nullable|string',
            'is_favorite' => 'nullable|boolean',
            'is_archived' => 'nullable|boolean',
            'last_edited_at' => 'nullable|date',
        ]);

        if (!isset($validated['last_edited_at'])) {
            $validated['last_edited_at'] = now();
        }

        $note->update($validated);

        return ResponseJSON::success('Note updated successfully', $note);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        $note->delete();
        return ResponseJSON::success('Note deleted successfully');
    }
}
