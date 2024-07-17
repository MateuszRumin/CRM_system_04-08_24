import React, { useState, useEffect } from 'react';
import styles from './RepositoryModal.module.css';

interface RepositoryModalProps {
  projectId: number;
}

export const RepositoryModal: React.FC<RepositoryModalProps> = ({ projectId }) => {
  const [repositoryLinks, setRepositoryLinks] = useState<string[]>(() => {
    const savedLinks = localStorage.getItem(`repositoryLinks_${projectId}`);
    return savedLinks ? JSON.parse(savedLinks) : [''];
  });

  useEffect(() => {
    localStorage.setItem(`repositoryLinks_${projectId}`, JSON.stringify(repositoryLinks));
  }, [repositoryLinks, projectId]);

  const handleAddLink = () => {
    setRepositoryLinks([...repositoryLinks, '']);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...repositoryLinks];
    newLinks[index] = value;
    setRepositoryLinks(newLinks);
  };

  const handleSaveLink = (index: number) => {
    localStorage.setItem(`repositoryLinks_${projectId}`, JSON.stringify(repositoryLinks));
    alert('Link zapisany!');
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = repositoryLinks.filter((_, i) => i !== index);
    setRepositoryLinks(newLinks);
  };

  const handleGoToLink = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className={styles.container}>
      <h2>Linki do repozytorium</h2>
      {repositoryLinks.map((link, index) => (
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
