import type { JSX } from "preact";
import { NoteItem } from "./NoteItem";

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

export function NoteList({ notes, selectedNoteId, onSelectNote }: NoteListProps): JSX.Element {
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
        />
      ))}
    </div>
  );
}
