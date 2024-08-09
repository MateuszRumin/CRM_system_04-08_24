import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RepositoryModal.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface RepositoryModalProps {
  projectId: number;
}

interface ProjectLink {
  link_id: number;
  link_type: string;
  link: string;
  name?: string;
}

export const RepositoryModal: React.FC<RepositoryModalProps> = ({ projectId }) => {
  const [repositoryLinks, setRepositoryLinks] = useState<ProjectLink[]>([]);
  const [newLink, setNewLink] = useState<string>('');

  useEffect(() => {
    axios.get(`${apiServerUrl}/projects/${projectId}`)
      .then(response => {
        const projectLinks = response.data.ProjectLink.filter((link: ProjectLink) => link.link_type === 'Repository');
        console.log('Załadowane linki:', projectLinks); // Log załadowanych linków
        setRepositoryLinks(projectLinks);
      })
      .catch(error => {
        console.error('Error fetching repository links:', error);
      });
  }, [projectId]);

  const handleAddLink = () => {
    if (newLink) {
      axios.post(`${apiServerUrl}/projects/link/repo`, {
        project_id: projectId,
        link: newLink,
        name: 'Repozytorium'
      })
      .then(response => {
        setRepositoryLinks([...repositoryLinks, response.data]);
        setNewLink('');
      })
      .catch(error => {
        console.error('Error adding repository link:', error);
      });
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...repositoryLinks];
    newLinks[index].link = value;
    setRepositoryLinks(newLinks);
  };

  const handleSaveLink = (index: number) => {
    const linkToUpdate = repositoryLinks[index];
    if (linkToUpdate.link_id) {
      axios.put(`${apiServerUrl}/projects/link/${linkToUpdate.link_id}`, linkToUpdate)
      .then(() => {
        alert('Link zapisany!');
      })
      .catch(error => {
        console.error('Error saving repository link:', error);
      });
    }
  };

  const handleRemoveLink = (index: number) => {
    const linkToRemove = repositoryLinks[index];
    if (linkToRemove.link_id) {
      console.log(`Usuwanie linku o ID: ${linkToRemove.link_id}`);
      axios.delete(`${apiServerUrl}/projects/link/${linkToRemove.link_id}`)
      .then(() => {
        setRepositoryLinks(repositoryLinks.filter((_, i) => i !== index));
        console.log(`Link o ID: ${linkToRemove.link_id} został usunięty`);
      })
      .catch(error => {
        console.error('Error removing repository link:', error);
      });
    } else {
      console.error('Brak ID linku do usunięcia:', linkToRemove);
    }
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
            value={link.link}
            onChange={(e) => handleLinkChange(index, e.target.value)}
            className={styles.input}
          />
          {/* <button onClick={() => handleSaveLink(index)} className={styles.button}>Zapisz</button> */}
          <button onClick={() => handleRemoveLink(index)} className={styles.button}>Usuń</button>
          <button onClick={() => handleGoToLink(link.link)} className={styles.button}>Otwórz</button>
        </div>
      ))}
      <div className={styles.newLinkRow}>
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Dodaj nowy link"
          className={styles.input}
        />
        <button onClick={handleAddLink} className={styles.addButton}>Dodaj</button>
      </div>
    </div>
  );
};
