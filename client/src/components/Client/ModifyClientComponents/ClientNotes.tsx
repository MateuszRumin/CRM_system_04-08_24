import React from 'react';
import { useData } from '../../../contexts/DataContext';
import styles from './ClientNotes.module.css';

interface Note {
  note_id: number;
  note_text: string;
}

interface ClientNotesProps {
  initialNotes: Note[];
}

export const ClientNotes: React.FC<ClientNotesProps> = ({ initialNotes }) => {
  const { addNote, updateNote, deleteNote } = useData();
  const [localNotes, setLocalNotes] = React.useState<Note[]>(initialNotes);
  const [newNoteText, setNewNoteText] = React.useState<string>('');
  const [editingNoteId, setEditingNoteId] = React.useState<number | null>(null);
  const [editedNoteText, setEditedNoteText] = React.useState<string>('');
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>({
    note_text: '',
  });

  React.useEffect(() => {
    setLocalNotes(initialNotes);
  }, [initialNotes]);

  const handleNewNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNoteText(e.target.value);
  };

  const validateNote = (): boolean => {
    let valid = true;
    const errors: { [key: string]: string } = {};

    if (newNoteText.trim() === '') {
      errors['note_text'] = 'Treść notatki jest wymagana';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSaveNote = () => {
    if (validateNote()) {
      const newNote: Note = {
        note_id: localNotes.length + 1, // Można rozważyć lepsze generowanie ID
        note_text: newNoteText,
      };
      setLocalNotes([...localNotes, newNote]);
      addNote(newNote);
      setNewNoteText('');
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.note_id);
    setEditedNoteText(note.note_text);
  };

  const handleSaveEditedNote = (noteId: number) => {
    if (validateNote()) {
      const updatedLocalNotes = localNotes.map((note) =>
        note.note_id === noteId ? { ...note, note_text: editedNoteText } : note
      );
      setLocalNotes(updatedLocalNotes);

      const updatedNote = { note_id: noteId, note_text: editedNoteText };
      updateNote(updatedNote);

      setEditingNoteId(null);
      setEditedNoteText('');
    }
  };

  const handleDeleteNote = (noteId: number) => {
    const updatedLocalNotes = localNotes.filter((note) => note.note_id !== noteId);
    setLocalNotes(updatedLocalNotes);

    deleteNote(noteId);
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.header}>
        <h2>Ustalenia z klientem</h2>
      </div>
      <div className={styles.notesFieldContainer}>
        <div className={styles.richTextEditor}>
          <textarea
            className={styles.TextAreaField}
            value={newNoteText}
            onChange={handleNewNoteChange}
            placeholder="Wpisz nową notatkę..."
          ></textarea>
          {formErrors.note_text && <p className={styles.error}>{formErrors.note_text}</p>}
        </div>
        <button className={styles.saveNoteButton} onClick={handleSaveNote}>
          Zapisz notatkę
        </button>
      </div>
      <div className={styles.notes}>
        {localNotes && localNotes.length > 0 ? (
          localNotes.map((note) => (
            <div key={note.note_id} className={styles.note}>
              {editingNoteId === note.note_id ? (
                <>
                  <textarea
                    className={styles.TextAreaField}
                    value={editedNoteText}
                    onChange={(e) => setEditedNoteText(e.target.value)}
                  ></textarea>
                  <button className={styles.saveNoteButton} onClick={() => handleSaveEditedNote(note.note_id)}>
                    Zapisz
                  </button>
                </>
              ) : (
                <>
                  <p className={styles.noteContent}>{note.note_text}</p>
                  <button onClick={() => handleEditNote(note)}>Edytuj</button>
                  <button onClick={() => handleDeleteNote(note.note_id)}>Usuń</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>Brak notatek do wyświetlenia</p>
        )}
      </div>
    </div>
  );
};
