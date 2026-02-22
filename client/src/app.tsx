import { useState, useEffect } from "preact/hooks";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "UX Consistency Review",
    body: "We have achieved visual consistency.\n\n1. Sidebar Borders:\nRemoved all borders inside the sidebar (no bottom borders on list items).\nThe only border remaining is the \"border-right\" separating the sidebar from the editor.",
    lastEdited: Date.now()
  },
  {
    id: "2",
    title: "Marketing Strategy",
    body: "Focus on organic growth channels and borderless design language...",
    lastEdited: Date.now() - 86400000
  },
  {
    id: "3",
    title: "Shopping List",
    body: "Milk, Eggs, Coffee beans, Spinach, Apples...",
    lastEdited: Date.now() - 86400000 * 2
  }
];

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("notize-notes");
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);

  useEffect(() => {
    localStorage.setItem("notize-notes", JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "",
      body: "",
      lastEdited: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.id === id ? { ...note, ...updates, lastEdited: Date.now() } : note
      );
      // Sort: Most recently edited at the top
      return [...updatedNotes].sort((a, b) => b.lastEdited - a.lastEdited);
    });
  };

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
