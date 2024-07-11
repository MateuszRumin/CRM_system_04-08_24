import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ClientRow.module.css';
import ThreeDotsSettings from '../../assets/ClientPage/three_dots_settings.svg';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
  status: string;
  projects: string;
  nextPayment: string;
  addedOn: string;
}

interface ClientRowProps {
  client: Client;
  onDelete: (clientId: number) => void;
}

export const ClientRow: React.FC<ClientRowProps> = ({ client, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Niepodjęty':
        return styles.niepodjety;
      case 'W trakcie':
        return styles.wTrakcie;
      case 'Zdobyty':
        return styles.zdobyty;
      case 'Stracony':
        return styles.stracony;
      default:
        return '';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    const clientId = client.id;
    const modifiedName = client.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    navigate(`/klienci/edit-client/${modifiedName}`, { state: { clientId, modifiedName } });
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const clientId = client.id;

      const response = await axios.delete(`http://localhost:3000/client/${clientId}/delete`);

      if (response.status === 200) {
        console.log('Klient został usunięty pomyślnie');
        onDelete(clientId); // Wywołanie funkcji przekazanej w propach
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Wystąpił błąd podczas usuwania klienta:', error);
    }
  };

  return (
    <>
      <tr className={styles.row}>
        <td>{client.name}</td>
        <td><span className={`${styles.status} ${getStatusClass(client.status)}`}>{client.status}</span></td>
        <td>{client.projects}</td>
        <td>{client.nextPayment}</td>
        <td>{client.addedOn}</td>
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
          <td colSpan={6}>
            <div className={styles.modalBackdrop}>
              <div className={styles.modal}>
                <p>Czy na pewno chcesz usunąć tego użytkownika?</p>
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
