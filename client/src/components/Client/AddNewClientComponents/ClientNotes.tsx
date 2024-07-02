import React, { useState, useEffect } from 'react';
import styles from './ClientNotes.module.css';
import { useData } from '../../../contexts/DataContext';

export function ClientNotes() {
  const { notes, addNote, isValidNotes, setValidNotes } = useData();
  const [newNote, setNewNote] = useState<string>('');

  // Initialize isValidNotes as true when component mounts
  useEffect(() => {
    setValidNotes(true);
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
    if (e.target.value.trim() === '') {
      setValidNotes(true); // Set back to true if the note field is empty
    } else {
      setValidNotes(false); // Set to false if there's content in the note field
    }
  };

  const handleSaveNote = () => {
    if (newNote.trim() !== '') {
      const timestamp = new Date().toLocaleString();
      addNote({
        note_id: notes.length + 1, // Generate unique ID (replace with your logic)
        note_text: newNote,
      });
      setNewNote('');
      setValidNotes(true); // Set isValidNotes to true after successfully saving note
    }
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
