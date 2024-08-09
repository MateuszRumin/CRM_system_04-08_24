import React from 'react';
import axios from 'axios';
import styles from './DeleteDocumentationModal.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface DeleteDocumentationModalProps {
  documentId: number;
  projectId: number;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteDocumentationModal: React.FC<DeleteDocumentationModalProps> = ({ documentId, projectId, onClose, onDelete }) => {
  const handleDelete = () => {
    axios.delete(`${apiServerUrl}/projects/doc/${documentId}`)
      .then(() => {
        onDelete();
      })
      .catch(error => {
        console.error('Error deleting documentation:', error);
      });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Usunąć dokumentację?</h2>
        <button onClick={handleDelete}>Usuń</button>
        <button onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );
};
