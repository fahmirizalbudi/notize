<?php

namespace App\Domain\Note\Actions;

use App\Domain\Note\Models\Note;
use App\Domain\Note\Repositories\NoteRepository;

/**
 * Class UpsertNoteAction
 * 
 * Domain action to create or update a note.
 * 
 * @package App\Domain\Note\Actions
 */
class UpsertNoteAction
{
    /**
     * @param NoteRepository $repository
     */
    public function __construct(
        protected NoteRepository $repository
    ) {}

    /**
     * Execute the upsert logic.
     * 
     * @param array<string, mixed> $data
     * @return Note
     */
    public function execute(array $data): Note
    {
        if (!isset($data['last_edited_at']) && (isset($data['title']) || isset($data['body']))) {
            $data['last_edited_at'] = now();
        }

        return $this->repository->upsert($data);
    }
}
