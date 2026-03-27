import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const NOTES_STORAGE_KEY = 'notes';

export type NoteChangeEvent =
  | { type: 'created'; note: Note }
  | { type: 'updated'; note: Note }
  | { type: 'deleted'; id: string }
  | { type: 'all'; notes: Note[] };

type NoteChangeListener = (event: NoteChangeEvent) => void;

class NoteStorageManager {
  private listeners: Set<NoteChangeListener> = new Set();
  private notes: Note[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      this.notes = await this.loadNotesFromStorage();
      this.isInitialized = true;
      this.notifyListeners({ type: 'all', notes: this.notes });
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  private async loadNotesFromStorage(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error loading notes from storage:', error);
      return [];
    }
  }

  private async saveNotesToStorage(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      this.notes = notes;
    } catch (error) {
      console.error('Error saving notes to storage:', error);
      throw error;
    }
  }

  private notifyListeners(event: NoteChangeEvent) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in note change listener:', error);
      }
    }
  }

  addListener(listener: NoteChangeListener): () => void {
    this.listeners.add(listener);

    // If already initialized, send current state immediately
    if (this.isInitialized) {
      listener({ type: 'all', notes: this.notes });
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  removeListener(listener: NoteChangeListener): void {
    this.listeners.delete(listener);
  }

  getCurrentNotes(): Note[] {
    return [...this.notes];
  }

  async createNote(content: string): Promise<Note> {
    try {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();

      const newNote: Note = {
        id,
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const updatedNotes = [newNote, ...this.notes];
      await this.saveNotesToStorage(updatedNotes);

      this.notifyListeners({ type: 'created', note: newNote });

      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    try {
      const updatedNotes = this.notes.filter((note) => note.id !== id);

      if (updatedNotes.length === this.notes.length) {
        return false; // Note not found
      }

      await this.saveNotesToStorage(updatedNotes);

      this.notifyListeners({ type: 'deleted', id });

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  async updateNote(id: string, content: string): Promise<Note | null> {
    try {
      const noteIndex = this.notes.findIndex((note) => note.id === id);
      if (noteIndex === -1) {
        return null;
      }

      const updatedNote: Note = {
        ...this.notes[noteIndex],
        content,
        updatedAt: Date.now(),
      };

      // Create a new array with the updated note
      const updatedNotes = this.notes.map((note) =>
        note.id === id ? updatedNote : note
      );

      await this.saveNotesToStorage(updatedNotes);

      this.notifyListeners({ type: 'updated', note: updatedNote });

      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  }
}

// Create singleton instance
const noteStorageManager = new NoteStorageManager();

// Export the singleton instance methods
export const createNote = (content: string) =>
  noteStorageManager.createNote(content);
export const deleteNote = (id: string) => noteStorageManager.deleteNote(id);
export const updateNote = (id: string, content: string) =>
  noteStorageManager.updateNote(id, content);
export const getAllNotes = () => noteStorageManager.getCurrentNotes();

// Export listener management
export const addNoteChangeListener = (listener: NoteChangeListener) =>
  noteStorageManager.addListener(listener);
export const removeNoteChangeListener = (listener: NoteChangeListener) =>
  noteStorageManager.removeListener(listener);

// Legacy function for backward compatibility
export async function getAllNotesAsync(): Promise<Note[]> {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
}
