import React, { useState, useEffect } from 'react';
import { useProjectData } from '../../../contexts/ProjectDataContext';
import styles from './ProjectNotes.module.css';

interface Note {
  note_id: number;
  note_text: string;
  isNew?: boolean;
}

export function ProjectNotes() {
  const { notes, setNotes, setValidNotes } = useProjectData();
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  const [noteText, setNoteText] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({ note_text: '' });

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (noteText.trim() === '' && editingNoteId === null) {
      setValidNotes(true);
    } else {
      setValidNotes(false);
    }
  }, [noteText, editingNoteId, setValidNotes]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
  };

  const validateNote = (noteText: string): boolean => {
    let valid = true;
    const errors: { [key: string]: string } = {};

    if (noteText.trim() === '') {
      errors['note_text'] = 'Treść notatki jest wymagana';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSaveNote = () => {
    if (validateNote(noteText)) {
      if (editingNoteId !== null) {
        const updatedNote: Note = { note_id: editingNoteId, note_text: noteText };
        const updatedLocalNotes = localNotes.map((note) =>
          note.note_id === editingNoteId ? updatedNote : note
        );
        setLocalNotes(updatedLocalNotes);
        setNotes(updatedLocalNotes);
        setNoteText('');
        setEditingNoteId(null);
      } else {
        const newNote: Note = { note_id: Date.now(), note_text: noteText, isNew: true };
        const updatedLocalNotes = [...localNotes, newNote];
        setLocalNotes(updatedLocalNotes);
        setNotes(updatedLocalNotes);
        setNoteText('');
      }
    }
  };

  const handleEditNote = (note: Note) => {
    setNoteText(note.note_text);
    setEditingNoteId(note.note_id);
  };

  const handleDeleteNote = (noteId: number) => {
    const updatedLocalNotes = localNotes.filter((note) => note.note_id !== noteId);
    setLocalNotes(updatedLocalNotes);
    setNotes(updatedLocalNotes);

    if (noteText.trim() === '' && editingNoteId === null) {
      setValidNotes(true);
    }
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.header}>
        <h2>Notatki projektowe</h2>
      </div>
      <div className={styles.notesFieldContainer}>
        <div className={styles.richTextEditor}>
          <textarea
            className={styles.TextAreaField}
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Wpisz nową notatkę..."
          ></textarea>
          {formErrors.note_text && <p className={styles.error}>{formErrors.note_text}</p>}
        </div>
        {editingNoteId !== null ? (
          <button className={styles.saveNoteButton} onClick={handleSaveNote}>
            Zapisz zmiany
          </button>
        ) : (
          <button className={styles.saveNoteButton} onClick={handleSaveNote}>
            Zapisz notatkę
          </button>
        )}
      </div>
      <div className={styles.notes}>
        {localNotes && localNotes.length > 0 ? (
          localNotes.map((note) => (
            <div key={note.note_id} className={styles.note}>
              <p className={styles.noteContent}>{note.note_text}</p>
              <div className={styles.button_container}>
                <button className={styles.edit_delete_Button} onClick={() => handleEditNote(note)}>
                  Edytuj
                </button>
                <button className={styles.edit_delete_Button} onClick={() => handleDeleteNote(note.note_id)}>
                  Usuń
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Brak notatek do wyświetlenia</p>
        )}
      </div>
    </div>
  );
}

export default ProjectNotes;
