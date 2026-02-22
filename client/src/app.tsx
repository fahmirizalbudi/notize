import { useState, useEffect } from "preact/hooks";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
}

const API_BASE_URL = "http://localhost:8000/api";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  useEffect(() => {
    fetch(`${API_BASE_URL}/notes`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const formattedNotes = res.data.map((n: any) => ({
            id: n.id,
            title: n.title || "",
            body: n.body || "",
            lastEdited: new Date(n.last_edited_at || n.updated_at).getTime()
          }));
          setNotes(formattedNotes);
          if (formattedNotes.length > 0 && !selectedNoteId) {
            setSelectedNoteId(formattedNotes[0].id);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch notes:", err))
      .finally(() => setLoading(false));
  }, []);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleNewNote = () => {
    const newId = crypto.randomUUID();
    const newNoteData = {
      id: newId,
      title: "",
      body: "",
    };

    fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNoteData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const n = res.data;
          const newNote: Note = {
            id: n.id,
            title: n.title || "",
            body: n.body || "",
            lastEdited: new Date(n.last_edited_at || n.updated_at).getTime()
          };
          setNotes([newNote, ...notes]);
          setSelectedNoteId(newNote.id);
        }
      })
      .catch((err) => console.error("Failed to create note:", err));
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    // Optimistic update
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.id === id ? { ...note, ...updates, lastEdited: Date.now() } : note
      );
      return [...updatedNotes].sort((a, b) => b.lastEdited - a.lastEdited);
    });

    // API update
    const laravelUpdates: any = {};
    if (updates.title !== undefined) laravelUpdates.title = updates.title;
    if (updates.body !== undefined) laravelUpdates.body = updates.body;

    fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(laravelUpdates),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          console.error("Failed to update note on server:", res.message);
        }
      })
      .catch((err) => console.error("Failed to update note:", err));
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh" }}>
        <p>Loading your notes...</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onNewNote={handleNewNote}
      />
      <Editor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
      />
    </>
  );
}
