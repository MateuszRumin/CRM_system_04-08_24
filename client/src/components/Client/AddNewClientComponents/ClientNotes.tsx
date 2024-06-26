import React, { useState } from 'react';
import styles from './ClientNotes.module.css';
import { useData } from '../../../contexts/DataContext';

export function ClientNotes() {
  const { notes, setNotes } = useData();
  const [newNote, setNewNote] = useState<string>('');

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const handleSaveNote = () => {
    if (newNote.trim() !== '') {
      const timestamp = new Date().toLocaleString();
      setNotes([...notes, { content: newNote, timestamp }]);
      setNewNote('');
      simulateDataSend(newNote);
    }
  };

  const simulateDataSend = (note: string) => {
    console.log('Symulacja wysłania notatki do serwera:', note);
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.header}>
        <h2>Ustalenia z klientem</h2>
        {/* <button className={styles.addNoteButton}>Dodaj nową notatkę</button> */}
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
            <p className={styles.noteContent}>{note.content}</p>
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
