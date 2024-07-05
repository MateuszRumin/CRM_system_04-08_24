import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmployeeRow.module.css';
import ThreeDotsSettings from '../../assets/ClientPage/three_dots_settings.svg';

interface Employee {
  id: number;
  name: string;
  email: string;
  contract: string;
  phoneNumber: string;
  address: string;
  position: string;
  role: string;
}

export const EmployeeRow: React.FC<{ employee: Employee }> = ({ employee }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {

    const modifiedName = employee.name
      .normalize('NFD') // Normalize to decomposed
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '-'); // Replace spaces with "-"

    navigate(`/pracownicy/edit-employee/${modifiedName}`, { state: { employee } });
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    console.log('Delete employee with id:', employee.id);
    setIsModalOpen(false);
  };

  return (
    <>
      <tr className={`${styles.row} ${styles.employeeRow}`}>
        <td>{employee.name}</td>
        <td>{employee.email}</td>
        <td>{employee.contract}</td>
        <td>{employee.phoneNumber}</td>
        <td>{employee.address}</td>
        <td>{employee.position}</td>
        <td>{employee.role}</td>
        <td className={styles.settingsContainer}>
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
          <td colSpan={8}>
            <div className={styles.modalBackdrop}>
              <div className={styles.modal}>
                <p>Czy na pewno chcesz usunąć tego pracownika?</p>
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
