import type { JSX } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";

interface Note {
  id: string;
  title: string;
  body: string;
  isFavorite: boolean;
  isArchived: boolean;
  lastEdited: number;
}

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "comfortable" | "compact";
  onViewModeChange: () => void;
}

export function Editor({ 
  note, onUpdateNote, onDeleteNote, searchQuery, onSearchChange, viewMode, onViewModeChange 
}: EditorProps): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(!!searchQuery);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleSearch = () => {
    if (isSearchVisible) {
      onSearchChange("");
      setIsSearchVisible(false);
    } else {
      setIsSearchVisible(true);
    }
  };

  const renderTopBar = () => (
    <div className="top-bar">
      <div className={`search-wrapper ${isSearchVisible ? "visible" : ""}`}>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={searchQuery}
          onInput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
        />
      </div>
      <button className="icon-btn" onClick={toggleSearch} title="Search">
        <i className={isSearchVisible ? "ri-close-line" : "ri-search-2-line"}></i>
      </button>
      <button 
        className="icon-btn" 
        onClick={onViewModeChange} 
        title={viewMode === "comfortable" ? "Switch to Compact View" : "Switch to Comfortable View"}
      >
        <i className={viewMode === "comfortable" ? "ri-layout-grid-line" : "ri-list-check"}></i>
      </button>
      
      {note && (
        <div className="dropdown-container" ref={dropdownRef}>
          <button 
            className="icon-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="More Actions"
          >
            <i className="ri-more-fill"></i>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button 
                className={`dropdown-item ${note.isFavorite ? "favorite-active" : ""}`}
                onClick={() => {
                  onUpdateNote(note.id, { isFavorite: !note.isFavorite });
                  setIsDropdownOpen(false);
                }}
              >
                <i className={note.isFavorite ? "ri-heart-3-fill" : "ri-heart-3-line"}></i>
                <span>{note.isFavorite ? "Unfavorite" : "Favorite"}</span>
              </button>

              <button 
                className="dropdown-item"
                onClick={() => {
                  onUpdateNote(note.id, { isArchived: !note.isArchived });
                  setIsDropdownOpen(false);
                }}
              >
                <i className={note.isArchived ? "ri-archive-fill" : "ri-archive-line"}></i>
                <span>{note.isArchived ? "Unarchive" : "Archive"}</span>
              </button>

              {onDeleteNote && (
                <button 
                  className="dropdown-item danger"
                  onClick={() => {
                    onDeleteNote(note.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>Delete Permanently</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!note) {
    return (
      <main className="main-content">
        {renderTopBar()}
        <div className="editor-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", color: "#e2e8f0", marginBottom: "16px" }}>
            <i className="ri-file-edit-line"></i>
          </div>
          <h3 style={{ color: "#475569", marginBottom: "8px" }}>Select a note to view</h3>
          <p style={{ color: "#94a3b8", maxWidth: "300px" }}>Choose a note from the list on the left to start editing or create a new one.</p>
        </div>
      </main>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString([], {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="main-content">
      {renderTopBar()}

      <div className="editor-wrapper">
        <div className="editor-date">Last edited {formatDate(note.lastEdited)}</div>
        <input
          type="text"
          className="editor-title"
          placeholder="Note Title"
          value={note.title}
          onInput={(e) => onUpdateNote(note.id, { title: (e.target as HTMLInputElement).value })}
        />
        <textarea
          className="editor-body"
          placeholder="Start writing..."
          value={note.body}
          onInput={(e) => onUpdateNote(note.id, { body: (e.target as HTMLTextAreaElement).value })}
        />
      </div>
    </main>
  );
}
