import type { JSX } from "preact";

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
}

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

export function Editor({ note, onUpdateNote }: EditorProps): JSX.Element {
  if (!note) {
    return (
      <main className="main-content">
        <div className="top-bar">
          <button className="icon-btn"><i className="ri-search-2-line"></i></button>
          <button className="icon-btn"><i className="ri-layout-grid-line"></i></button>
          <button className="icon-btn"><i className="ri-more-fill"></i></button>
        </div>
        <div className="editor-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <p style={{ color: "#94a3b8" }}>Select a note to start writing</p>
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
      <div className="top-bar">
        <button className="icon-btn"><i className="ri-search-2-line"></i></button>
        <button className="icon-btn"><i className="ri-layout-grid-line"></i></button>
        <button className="icon-btn"><i className="ri-more-fill"></i></button>
      </div>

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
