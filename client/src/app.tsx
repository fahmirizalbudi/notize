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
type ViewMode = "comfortable" | "compact";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("comfortable");
  
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
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

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
          setSearchQuery("");
        }
      })
      .catch((err) => console.error("Failed to create note:", err));
  };

  const syncUpdateToServer = (id: string, updates: Partial<Note>) => {
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

  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.id === id ? { ...note, ...updates, lastEdited: Date.now() } : note
      );
      if (updates.title !== undefined || updates.body !== undefined) {
        return updatedNotes; 
      }
      return [...updatedNotes].sort((a, b) => b.lastEdited - a.lastEdited);
    });

    if (updates.isFavorite !== undefined || updates.isArchived !== undefined) {
      syncUpdateToServer(id, updates);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      syncUpdateToServer(id, updates);
    }, 500) as unknown as number;
    setDebounceTimer(timer);
  };

  const handleDeleteNote = (id: string) => {
    setNoteToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!noteToDeleteId) return;
    const id = noteToDeleteId;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
    setIsDeleteDialogOpen(false);
    setNoteToDeleteId(null);

    fetch(`${API_BASE_URL}/notes/${id}`, { method: "DELETE" });
  };

  return (
    <>
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onNewNote={handleNewNote}
        currentFilter={currentFilter}
        onFilterChange={(f) => {
          setCurrentFilter(f);
          setSearchQuery("");
        }}
        viewMode={viewMode}
      />
      <Editor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={() => setViewMode(viewMode === "comfortable" ? "compact" : "comfortable")}
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
