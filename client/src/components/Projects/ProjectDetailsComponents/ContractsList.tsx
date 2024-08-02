import React from 'react';
import styles from './ContractsList.module.css';

const ContractsList: React.FC = () => {
  const contracts = [
    { contractName: 'Umowa 1', date: '12.12.2024' },
    { contractName: 'Umowa 2', date: '12.12.2024' },
    { contractName: 'Umowa 3', date: '12.12.2024' },
  ];

  return (
    <div className={styles.contracts}>
      <h2>Lista umów</h2>
      <table className={styles.contractsTable}>
        <thead>
          <tr>
            <th>Nazwa umowy</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index}>
              <td>{contract.contractName}</td>
              <td>{contract.date}</td>
              <td>
                <button className={styles.detailsButton}>Szczegóły</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addButton}>Dodaj</button>
    </div>
  );
};

export default ContractsList;
