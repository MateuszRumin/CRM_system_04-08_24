import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddDocumentationModal.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface AddDocumentationModalProps {
  projectId: number;
  onClose: () => void;
  onAdd: () => void;
}

export const AddDocumentationModal: React.FC<AddDocumentationModalProps> = ({ projectId, onClose, onAdd }) => {
  const [fileName, setFileName] = useState<string>('');
  const [docDescription, setDocDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');

  const handleAdd = () => {
    axios.post(`${apiServerUrl}/projects/doc`, {
      project_id: projectId,
      file_name: fileName,
      doc_description: docDescription,
      link: link
    })
    .then(() => {
      onAdd();
    })
    .catch(error => {
      console.error('Error adding documentation:', error);
    });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Dodaj dokumentację</h2>
        <label>
          Nazwa pliku:
          <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        </label>
        <label>
          Opis dokumentacji:
          <input type="text" value={docDescription} onChange={(e) => setDocDescription(e.target.value)} />
        </label>
        <label>
          Link:
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
        </label>
        <button onClick={handleAdd}>Dodaj</button>
        <button onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );
};
