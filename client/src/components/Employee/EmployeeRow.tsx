import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmployeeRow.module.css';
import ThreeDotsSettings from '../../assets/ClientPage/three_dots_settings.svg';
import axios from 'axios';

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

interface EmployeeRowProps {
  employee: Employee;
  onDelete: (id: number) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, onDelete }) => {
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
    setIsMenuOpen(prev => !prev);
  };

  const handleEdit = () => {
    const modifiedName = employee.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    navigate(`/pracownicy/edit-employee/${modifiedName}`, { state: { employee } });
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/employees/${employee.id}`);
      onDelete(employee.id); // Notify the parent component
    } catch (error) {
      console.error('There was a problem deleting the employee:', error);
    }
    setIsModalOpen(false);
  };

  const handleDetails = () => {
    const modifiedName = employee.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    navigate(`/pracownicy/details-employee/${modifiedName}`, { state: { employee } });
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
          <button className={styles.detailsButton} onClick={handleDetails}>Szczegóły</button>
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
