import React, { useState } from 'react';
import styles from './RepositoryModal.module.css';

interface RepositoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (link: string) => void;
}

export const RepositoryModal: React.FC<RepositoryModalProps> = ({ visible, onClose, onSave }) => {
  const [repositoryLink, setRepositoryLink] = useState('');

  const handleSave = () => {
    onSave(repositoryLink);
  };

  const handleGoToRepository = () => {
    window.open(repositoryLink, '_blank');
  };

  return (
    <>
      {visible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Link do repozytorium</h2>
            <p>Link: <input type="text" value={repositoryLink} onChange={(e) => setRepositoryLink(e.target.value)} /></p>
            <div className={styles.gotoButtonContainer}>
              <button className={`${styles.button} ${styles.goToButton}`} onClick={handleGoToRepository}>Przejdź do repozytorium</button>
            </div>
            <div className={styles.saveAndCloseButtonContainer}>
              <button className={styles.button} onClick={handleSave}>Zapisz</button>
              <button className={`${styles.button} ${styles.closeButton}`} onClick={onClose}>Zamknij</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
