import type { JSX } from "preact";
import { NoteItem } from "./NoteItem";
import type { Note, ViewMode } from "../features/notes/types";

interface NoteListProps {
  /** Array of notes to render */
  notes: Note[];
  /** ID of the selected note for highlighting */
  selectedNoteId: string | null;
  /** Callback fired when a note item is clicked */
  onSelectNote: (id: string) => void;
  /** Visual density of the note items */
  viewMode: ViewMode;
}

/**
 * Renders a scrollable list of note previews.
 * Displays an empty state if no notes are provided.
 * 
 * @param props - Component properties
 * @returns JSX.Element
 */
export function NoteList({ notes, selectedNoteId, onSelectNote, viewMode }: NoteListProps): JSX.Element {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (date.getTime() > now.getTime() - 86400000) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (notes.length === 0) {
    return (
      <div className="no-results">
        <i className="ri-search-line"></i>
        <p>No notes found</p>
      </div>
    );
  }

  return (
    <div className="note-list-container">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          id={note.id}
          title={note.title}
          preview={note.body}
          date={formatDate(note.lastEdited)}
          selected={selectedNoteId === note.id}
          onClick={onSelectNote}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
