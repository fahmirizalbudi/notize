import { useState } from "preact/hooks";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { useNotes } from "./features/notes/useNotes";
import type { ViewMode } from "./features/notes/types";

/**
 * Main Application Component.
 * Orchestrates the Sidebar, Editor, and Global Modals.
 * 
 * @returns JSX.Element
 */
export function App() {
  const {
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
  } = useNotes();

  const [viewMode, setViewMode] = useState<ViewMode>("comfortable");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);

  /**
   * Triggers the custom deletion confirmation dialog.
   * @param id - The ID of the note to be deleted.
   */
  const initiateDelete = (id: string) => {
    setNoteToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Executes the deletion after user confirmation.
   */
  const confirmDelete = () => {
    if (noteToDeleteId) {
      handleDeleteNote(noteToDeleteId);
      setIsDeleteDialogOpen(false);
      setNoteToDeleteId(null);
    }
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
        viewMode={viewMode}
      />
      <Editor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={initiateDelete}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={() => setViewMode(prev => prev === "comfortable" ? "compact" : "comfortable")}
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
