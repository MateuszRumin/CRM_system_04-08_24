import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddNewProjectButton.module.css';

export const AddNewProjectButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/projekty/add-project');
  };

  return (
    <button className={styles.addButton} onClick={handleClick}>
      Dodaj Nowy Projekt
    </button>
  );
};
