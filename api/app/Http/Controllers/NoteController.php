<?php

namespace App\Http\Controllers;

use App\Domain\Note\Models\Note;
use App\Domain\Note\Repositories\NoteRepository;
use App\Domain\Note\Actions\UpsertNoteAction;
use App\Http\Response\ResponseJSON;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Class NoteController
 * 
 * Interface for note-related API endpoints.
 * 
 * @package App\Http\Controllers
 */
class NoteController extends Controller
{
    /**
     * @param NoteRepository $repository
     * @param UpsertNoteAction $upsertAction
     */
    public function __construct(
        protected NoteRepository $repository,
        protected UpsertNoteAction $upsertAction
    ) {}

    /**
     * Fetch all available notes.
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $notes = $this->repository->getAll();
        return ResponseJSON::success('Notes retrieved successfully', $notes);
    }

    /**
     * Create a new note.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'title' => 'nullable|string',
            'body' => 'nullable|string',
            'is_favorite' => 'nullable|boolean',
            'is_archived' => 'nullable|boolean',
        ]);

        $note = $this->upsertAction->execute($validated);

        return ResponseJSON::success('Note created successfully', $note);
    }

    /**
     * Show a single note.
     * 
     * @param Note $note
     * @return JsonResponse
     */
    public function show(Note $note): JsonResponse
    {
        return ResponseJSON::success('Note retrieved successfully', $note);
    }

    /**
     * Update an existing note.
     * 
     * @param Request $request
     * @param Note $note
     * @return JsonResponse
     */
    public function update(Request $request, Note $note): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'body' => 'nullable|string',
            'is_favorite' => 'nullable|boolean',
            'is_archived' => 'nullable|boolean',
            'last_edited_at' => 'nullable|date',
        ]);

        $data = array_merge(['id' => $note->id], $validated);
        $updatedNote = $this->upsertAction->execute($data);

        return ResponseJSON::success('Note updated successfully', $updatedNote);
    }

    /**
     * Remove a note from storage.
     * 
     * @param Note $note
     * @return JsonResponse
     */
    public function destroy(Note $note): JsonResponse
    {
        $this->repository->delete($note);
        return ResponseJSON::success('Note deleted successfully');
    }
}
