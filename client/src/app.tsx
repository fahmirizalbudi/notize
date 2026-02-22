import { useState, useEffect } from "preact/hooks";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { ConfirmDialog } from "./components/ConfirmDialog";

interface Note {
  id: string;
  title: string;
  body: string;
  isFavorite: boolean;
  isArchived: boolean;
  lastEdited: number;
}

const API_BASE_URL = "http://localhost:8000/api";

type Filter = "all" | "favorites" | "archive";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<Filter>("all");
  
  // Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);

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
            isFavorite: !!n.is_favorite,
            isArchived: !!n.is_archived,
            lastEdited: new Date(n.last_edited_at || n.updated_at).getTime()
          }));
          setNotes(formattedNotes);
          if (formattedNotes.length > 0 && !selectedNoteId) {
            const firstVisible = formattedNotes.find((n: Note) => !n.isArchived);
            if (firstVisible) setSelectedNoteId(firstVisible.id);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch notes:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredNotes = notes.filter((note) => {
    if (currentFilter === "favorites") return note.isFavorite && !note.isArchived;
    if (currentFilter === "archive") return note.isArchived;
    return !note.isArchived;
  });

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleNewNote = () => {
    const newId = crypto.randomUUID();
    const newNoteData = {
      id: newId,
      title: "",
      body: "",
      is_favorite: false,
      is_archived: false
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
            isFavorite: !!n.is_favorite,
            isArchived: !!n.is_archived,
            lastEdited: new Date(n.last_edited_at || n.updated_at).getTime()
          };
          setNotes([newNote, ...notes]);
          setSelectedNoteId(newNote.id);
          setCurrentFilter("all");
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
    if (updates.isFavorite !== undefined) laravelUpdates.is_favorite = updates.isFavorite;
    if (updates.isArchived !== undefined) laravelUpdates.is_archived = updates.isArchived;

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

  const handleDeleteNote = (id: string) => {
    setNoteToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!noteToDeleteId) return;
    
    const id = noteToDeleteId;

    // Optimistic update
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }

    setIsDeleteDialogOpen(false);
    setNoteToDeleteId(null);

    fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          console.error("Failed to delete note on server:", res.message);
        }
      })
      .catch((err) => console.error("Failed to delete note:", err));
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onNewNote={handleNewNote}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
      <Editor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
