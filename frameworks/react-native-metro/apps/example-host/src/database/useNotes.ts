import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type Note,
  type NoteChangeEvent,
  addNoteChangeListener,
  createNote,
  deleteNote,
  updateNote,
} from './NoteStorageManager';

export interface UseNotesReturn {
  notes: Note[];
  createNote: (content: string) => Promise<Note>;
  updateNote: (id: string, content: string) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = addNoteChangeListener((event: NoteChangeEvent) => {
      if (!isMounted) return;

      switch (event.type) {
        case 'created':
          setNotes((prev) => [event.note, ...prev]);
          break;
        case 'updated':
          setNotes((prev) =>
            prev.map((note) => (note.id === event.note.id ? event.note : note))
          );
          break;
        case 'deleted':
          setNotes((prev) => prev.filter((note) => note.id !== event.id));
          break;
        case 'all':
          setNotes(event.notes);
          setIsLoading(false);
          setError(null);
          break;
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const createNoteHandler = useCallback(
    async (content: string): Promise<Note> => {
      try {
        setError(null);
        return await createNote(content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create note';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateNoteHandler = useCallback(
    async (id: string, content: string): Promise<Note | null> => {
      try {
        setError(null);
        return await updateNote(id, content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update note';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteNoteHandler = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        return await deleteNote(id);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete note';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const memoizedNotes = useMemo(() => notes, [notes]);

  return {
    notes: memoizedNotes,
    createNote: createNoteHandler,
    updateNote: updateNoteHandler,
    deleteNote: deleteNoteHandler,
    isLoading,
    error,
  };
}
