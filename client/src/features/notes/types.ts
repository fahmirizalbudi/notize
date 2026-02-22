/**
 * Represents a single note in the application.
 */
export interface Note {
  /** Unique UUID identifier */
  id: string;
  /** Title of the note */
  title: string;
  /** Content of the note */
  body: string;
  /** Whether the note is pinned as favorite */
  isFavorite: boolean;
  /** Whether the note has been archived */
  isArchived: boolean;
  /** Unix timestamp of the last edit */
  lastEdited: number;
}

/**
 * Available filters for the notes list.
 */
export type NoteFilter = "all" | "favorites" | "archive";

/**
 * Sidebar view modes.
 */
export type ViewMode = "comfortable" | "compact";

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
