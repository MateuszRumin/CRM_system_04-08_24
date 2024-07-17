import React, { useState, useEffect } from 'react';
import styles from './FigmaModal.module.css';

interface FigmaModalProps {
  projectId: number;
}

export const FigmaModal: React.FC<FigmaModalProps> = ({ projectId }) => {
  const [figmaLinks, setFigmaLinks] = useState<string[]>(() => {
    const savedLinks = localStorage.getItem(`figmaLinks_${projectId}`);
    return savedLinks ? JSON.parse(savedLinks) : [''];
  });

  useEffect(() => {
    localStorage.setItem(`figmaLinks_${projectId}`, JSON.stringify(figmaLinks));
  }, [figmaLinks, projectId]);

  const handleAddLink = () => {
    setFigmaLinks([...figmaLinks, '']);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...figmaLinks];
    newLinks[index] = value;
    setFigmaLinks(newLinks);
  };

  const handleSaveLink = (index: number) => {
    localStorage.setItem(`figmaLinks_${projectId}`, JSON.stringify(figmaLinks));
    alert('Link zapisany!');
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = figmaLinks.filter((_, i) => i !== index);
    setFigmaLinks(newLinks);
  };

  const handleGoToLink = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className={styles.container}>
      <h2>Linki do projektu w Figma</h2>
      {figmaLinks.map((link, index) => (
        <div key={index} className={styles.linkRow}>
          <input
            type="text"
            value={link}
            onChange={(e) => handleLinkChange(index, e.target.value)}
            className={styles.input}
          />
          <button onClick={() => handleSaveLink(index)} className={styles.button}>Zapisz</button>
          <button onClick={() => handleRemoveLink(index)} className={styles.button}>Usuń</button>
          <button onClick={() => handleGoToLink(link)} className={styles.button}>Otwórz</button>
        </div>
      ))}
      <button onClick={handleAddLink} className={styles.addButton}>Dodaj nowe pole tekstowe</button>
    </div>
  );
};
