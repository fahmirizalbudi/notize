import type { JSX } from "preact";
import { NoteList } from "./NoteList";

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
}

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  currentFilter: "all" | "favorites" | "archive";
  onFilterChange: (filter: "all" | "favorites" | "archive") => void;
  viewMode: "comfortable" | "compact";
}

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
