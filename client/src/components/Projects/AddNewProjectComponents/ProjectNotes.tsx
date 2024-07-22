import React, { useState, useEffect } from 'react';
import styles from './ProjectNotes.module.css';
import { useProjectData } from '../../../contexts/ProjectDataContext';

export function ProjectNotes() {
  const { notes, addNote, isValidNotes, setValidNotes } = useProjectData();
  const [newNote, setNewNote] = useState<string>('');

  useEffect(() => {
    setValidNotes(true);
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
    if (e.target.value.trim() === '') {
      setValidNotes(true);
    } else {
      setValidNotes(false);
    }
  };

  const handleSaveNote = () => {
    if (newNote.trim() !== '') {
      addNote({
        note_id: notes.length + 1,
        note_text: newNote,
      });
      setNewNote('');
      setValidNotes(true);
    }
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.header}>
        <h2>Opis projektu</h2>
      </div>
      <div className={styles.notesFieldContainer}>
        <div className={styles.richTextEditor}>
          <textarea
            className={styles.TextAreaField}
            value={newNote}
            onChange={handleNoteChange}
            placeholder="Wpisz nową notatkę..."
          ></textarea>
        </div>
        <button className={styles.saveNoteButton} onClick={handleSaveNote}>
          Zapisz notatkę
        </button>
      </div>
      <div className={styles.notes}>
        {notes.map((note, index) => (
          <div key={index} className={styles.note}>
            <p className={styles.noteContent}>{note.note_text}</p>
            <div className={styles.noteFooter}>
              <img src="/path/to/admin_avatar.png" alt="Admin Avatar" className={styles.avatar} />
              <div className={styles.noteAuthor}>
                Jan Kowalski<br />{note.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
