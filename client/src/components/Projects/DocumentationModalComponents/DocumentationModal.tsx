import React from 'react';
import styles from './DocumentationModal.module.css';

interface DocumentationModalProps {
  document: any;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ document, onClose }) => {
  // Pobierz link z obiektu ProjectLink
  const documentationLink = document.ProjectLink?.link || '';

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Szczegóły dokumentacji</h2>
        <p>Nazwa: {document.file_name}</p>
        <p>Opis: {document.doc_description}</p>
        {documentationLink && (
          <div>
            <p>Link do dokumentacji:  <a href={documentationLink} target="_blank" rel="noopener noreferrer">
              {documentationLink}
            </a></p>
            
          </div>
        )}
        <button onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};
