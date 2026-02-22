import type { JSX } from "preact";

interface NoteItemProps {
  id: string;
  title: string;
  preview: string;
  date: string;
  selected: boolean;
  onClick: (id: string) => void;
}

export function NoteItem({ id, title, preview, date, selected, onClick }: NoteItemProps): JSX.Element {
  return (
    <button
      className={`note-item ${selected ? "selected" : ""}`}
      onClick={() => onClick(id)}
    >
      <div className="note-title">{title || "Untitled Note"}</div>
      <div className="note-preview">{preview || "No content..."}</div>
      <div className="note-date">{date}</div>
    </button>
  );
}
