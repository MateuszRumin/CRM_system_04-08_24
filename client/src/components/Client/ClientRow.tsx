import React from 'react';
import styles from './ClientRow.module.css';
import ThreeDotsSettings from '../../assets/ClientPage/three_dots_settings.svg';

interface Client {
  name: string;
  status: string;
  projects: string;
  nextPayment: string;
  addedOn: string;
}

export const ClientRow: React.FC<{ client: Client }> = ({ client }) => {
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

  return (
    <tr className={styles.row}>
      <td>{client.name}</td>
      <td><span className={`${styles.status} ${getStatusClass(client.status)}`}>{client.status}</span></td>
      <td>{client.projects}</td>
      <td>{client.nextPayment}</td>
      <td>{client.addedOn}</td>
      <td>
        <img src={ThreeDotsSettings} alt="Settings" className={styles.settingsIcon} />
      </td>
    </tr>
  );
};