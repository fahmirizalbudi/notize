<?php

namespace App\Domain\Note\Repositories;

use App\Domain\Note\Models\Note;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class NoteRepository
 * 
 * Handles data persistence and retrieval for the Note domain.
 * 
 * @package App\Domain\Note\Repositories
 */
class NoteRepository
{
    /**
     * Retrieve all notes ordered by last edited date.
     * 
     * @return Collection<int, Note>
     */
    public function getAll(): Collection
    {
        return Note::orderBy('last_edited_at', 'desc')->get();
    }

    /**
     * Find a specific note by ID.
     * 
     * @param string $id
     * @return Note|null
     */
    public function find(string $id): ?Note
    {
        return Note::find($id);
    }

    /**
     * Persist a note to the database.
     * 
     * @param array<string, mixed> $data
     * @return Note
     */
    public function upsert(array $data): Note
    {
        return Note::updateOrCreate(
            ['id' => $data['id'] ?? null],
            $data
        );
    }

    /**
     * Delete a note.
     * 
     * @param Note $note
     * @return bool|null
     */
    public function delete(Note $note): ?bool
    {
        return $note->delete();
    }
}
