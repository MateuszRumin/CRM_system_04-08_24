import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProjectRow.module.css';
import ThreeDotsSettings from '../../assets/ClientPage/three_dots_settings.svg';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface ProjectRowProps {
  project: {
    project_id: number;
    name: string;
    status: { name: string };
    client: { first_name: string; second_name: string; company_name: string };
    startDate: string;
    endDate: string;
  };
  onDelete: (projectId: number) => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({ project, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.settingsContainer}`)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setIsMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    navigate(`/projekty/edit-project/${project.project_id}`, { state: { project } });
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${apiServerUrl}/projects/${project.project_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(project.project_id);
        setIsModalOpen(false);
      } else {
        console.error('Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const handleDetails = () => {
    navigate(`/projekty/details-project/${project.project_id}`, { state: { project } });
  };

  return (
    <>
      <tr className={`${styles.row} ${styles.projectRow}`}>
        <td>{project.name || 'Brak nazwy'}</td>
        <td>{project.status?.name || 'Brak statusu'}</td>
        <td>{`${project.client?.first_name || 'Brak'} ${project.client?.second_name || 'Danych'}`}</td>
        <td>{new Date(project.startDate).toLocaleDateString()}</td>
        <td>{new Date(project.endDate).toLocaleDateString()}</td>
        <td className={styles.settingsContainer}>
          <button className={styles.detailsButton} onClick={handleDetails}>
            Szczegóły
          </button>
          <img
            src={ThreeDotsSettings}
            alt="Settings"
            className={styles.settingsIcon}
            onClick={toggleMenu}
          />
          {isMenuOpen && (
            <div className={styles.contextMenu}>
              <div onClick={handleEdit}>Edytuj</div>
              <div onClick={handleDelete}>Usuń</div>
            </div>
          )}
        </td>
      </tr>

      {isModalOpen && (
        <tr>
          <td colSpan={6}>
            <div className={styles.modalBackdrop}>
              <div className={styles.modal}>
                <p>Czy na pewno chcesz usunąć ten projekt?</p>
                <button onClick={confirmDelete}>Tak</button>
                <button onClick={() => setIsModalOpen(false)}>Nie</button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ProjectRow;
