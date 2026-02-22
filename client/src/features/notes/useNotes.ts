import { useState, useEffect, useMemo } from "preact/hooks";
import type { Note, NoteFilter } from "./types";
import { noteService } from "./noteService";

/**
 * Custom hook to manage notes state and synchronized actions.
 * 
 * @returns An object containing notes state, filtered notes, and handlers.
 */
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<NoteFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    noteService.fetchAll()
      .then((data) => {
        setNotes(data);
        const firstVisible = data.find(n => !n.isArchived);
        if (firstVisible) setSelectedNoteId(firstVisible.id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.body.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (currentFilter === "favorites") return note.isFavorite && !note.isArchived;
      if (currentFilter === "archive") return note.isArchived;
      return !note.isArchived;
    });
  }, [notes, currentFilter, searchQuery]);

  const selectedNote = useMemo(() => 
    notes.find((n) => n.id === selectedNoteId) || null
  , [notes, selectedNoteId]);

  const handleNewNote = async () => {
    const id = crypto.randomUUID();
    try {
      const newNote = await noteService.create(id);
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      setCurrentFilter("all");
      setSearchQuery("");
    } catch (error) {
      console.error(error);
    }
  };

  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => {
      const updated = prev.map((n) => 
        n.id === id ? { ...n, ...updates, lastEdited: Date.now() } : n
      );
      if (updates.title !== undefined || updates.body !== undefined) return updated;
      return [...updated].sort((a, b) => b.lastEdited - a.lastEdited);
    });

    if (updates.isFavorite !== undefined || updates.isArchived !== undefined) {
      noteService.update(id, updates).catch(console.error);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      noteService.update(id, updates).catch(console.error);
    }, 500) as unknown as number;
    setDebounceTimer(timer);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteService.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    notes,
    filteredNotes,
    selectedNote,
    selectedNoteId,
    loading,
    currentFilter,
    searchQuery,
    setSelectedNoteId,
    setCurrentFilter,
    setSearchQuery,
    handleNewNote,
    handleUpdateNote,
    handleDeleteNote,
  };
}
