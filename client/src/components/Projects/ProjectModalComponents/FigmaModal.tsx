import React, { useState } from 'react';
import styles from './FigmaModal.module.css';

interface FigmaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (link: string) => void;
}

export const FigmaModal: React.FC<FigmaModalProps> = ({ visible, onClose, onSave }) => {
  const [figmaLink, setFigmaLink] = useState('');

  const handleSave = () => {
    onSave(figmaLink);
  };

  const handleGoToFigma = () => {
    window.open(figmaLink, '_blank');
  };

  return (
    <>
      {visible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Link do projektu w Figma</h2>
            <p>Link: <input type="text" value={figmaLink} onChange={(e) => setFigmaLink(e.target.value)} /></p>
            <div className={styles.gotoButtonContainer}>
              <button className={`${styles.button} ${styles.goToButton}`} onClick={handleGoToFigma}>Przejdź do Figma</button>
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
