import type { JSX } from "preact";
import { NoteList } from "./NoteList";
import type { Note, NoteFilter, ViewMode } from "../features/notes/types";

interface SidebarProps {
  /** Array of notes to display in the list */
  notes: Note[];
  /** ID of the currently active note */
  selectedNoteId: string | null;
  /** Callback fired when a note is selected from the list */
  onSelectNote: (id: string) => void;
  /** Callback to trigger creation of a new note */
  onNewNote: () => void;
  /** The currently active category filter */
  currentFilter: NoteFilter;
  /** Callback to change the active filter */
  onFilterChange: (filter: NoteFilter) => void;
  /** The current visual density of the list */
  viewMode: ViewMode;
}

/**
 * Sidebar component containing navigation and the notes list.
 * 
 * @param props - Component properties
 * @returns JSX.Element
 */
export function Sidebar({ notes, selectedNoteId, onSelectNote, onNewNote, currentFilter, onFilterChange, viewMode }: SidebarProps): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="brand">
        <i className="ri-book-mark-fill brand-icon"></i>
        <span className="brand-text">Notize</span>
      </div>

      <button className="ui-item btn-new" onClick={onNewNote}>
        <i className="ri-add-line"></i>
        <span>New Note</span>
      </button>

      <nav className="menu-list">
        <div
          className={`ui-item menu-item ${currentFilter === "all" ? "active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          <i className="ri-file-list-2-line"></i>
          <span>All Notes</span>
        </div>
        <div
          className={`ui-item menu-item ${currentFilter === "favorites" ? "active" : ""}`}
          onClick={() => onFilterChange("favorites")}
        >
          <i className="ri-heart-3-line"></i>
          <span>Favorites</span>
        </div>
        <div
          className={`ui-item menu-item ${currentFilter === "archive" ? "active" : ""}`}
          onClick={() => onFilterChange("archive")}
        >
          <i className="ri-archive-line"></i>
          <span>Archive</span>
        </div>
      </nav>

      <div className="section-label">
        {currentFilter === "all" ? "Recent" : currentFilter === "favorites" ? "Favorites" : "Archived"}
      </div>

      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={onSelectNote}
        viewMode={viewMode}
      />
    </aside>
  );
}
