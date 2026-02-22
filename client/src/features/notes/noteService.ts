import type { Note, ApiResponse } from "./types";

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Service for interacting with the Note domain API.
 */
export const noteService = {
  /**
   * Fetches all notes from the server.
   * @returns A promise that resolves to an array of Notes.
   */
  async fetchAll(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    const result: ApiResponse<any[]> = await response.json();
    
    if (!result.success) throw new Error(result.message);

    return result.data.map((n) => ({
      id: n.id,
      title: n.title || "",
      body: n.body || "",
      isFavorite: !!n.is_favorite,
      isArchived: !!n.is_archived,
      lastEdited: new Date(n.last_edited_at || n.updated_at).getTime(),
    }));
  },

  /**
   * Persists a new note.
   * @param id - The UUID for the new note.
   * @returns The created Note.
   */
  async create(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: "", body: "" }),
    });
    const result: ApiResponse<any> = await response.json();
    
    const n = result.data;
    return {
      id: n.id,
      title: n.title || "",
      body: n.body || "",
      isFavorite: !!n.is_favorite,
      isArchived: !!n.is_archived,
      lastEdited: new Date(n.last_edited_at || n.updated_at).getTime(),
    };
  },

  /**
   * Updates an existing note on the server.
   * @param id - Note ID.
   * @param updates - Partial object containing fields to update.
   */
  async update(id: string, updates: Partial<Note>): Promise<void> {
    const laravelUpdates: any = {};
    if (updates.title !== undefined) laravelUpdates.title = updates.title;
    if (updates.body !== undefined) laravelUpdates.body = updates.body;
    if (updates.isFavorite !== undefined) laravelUpdates.is_favorite = updates.isFavorite;
    if (updates.isArchived !== undefined) laravelUpdates.is_archived = updates.isArchived;

    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(laravelUpdates),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
  },

  /**
   * Deletes a note permanently.
   * @param id - Note ID.
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
  },
};
