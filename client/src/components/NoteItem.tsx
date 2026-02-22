import type { JSX } from "preact";

interface NoteItemProps {
  id: string;
  title: string;
  preview: string;
  date: string;
  selected: boolean;
  onClick: (id: string) => void;
  viewMode: "comfortable" | "compact";
}

export function NoteItem({ id, title, preview, date, selected, onClick, viewMode }: NoteItemProps): JSX.Element {
  return (
    <button
      className={`note-item ${selected ? "selected" : ""} ${viewMode === "compact" ? "compact" : ""}`}
      onClick={() => onClick(id)}
    >
      <div className="note-title">{title || "Untitled Note"}</div>
      <div className="note-preview">{preview || "No content..."}</div>
      <div className="note-date">{date}</div>
    </button>
  );
}
