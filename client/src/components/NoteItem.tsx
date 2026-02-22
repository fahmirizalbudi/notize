import type { JSX } from "preact";
import type { ViewMode } from "../features/notes/types";

interface NoteItemProps {
  /** Note UUID */
  id: string;
  /** Display title */
  title: string;
  /** Snippet of the note content */
  preview: string;
  /** Formatted date string */
  date: string;
  /** Whether this item is currently selected */
  selected: boolean;
  /** Callback fired on click */
  onClick: (id: string) => void;
  /** The current visual density mode */
  viewMode: ViewMode;
}

/**
 * Individual note preview item used within the Sidebar list.
 * 
 * @param props - Component properties
 * @returns JSX.Element
 */
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
