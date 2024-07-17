import React from 'react';
import styles from './DocumentationList.module.css';

const DocumentationList: React.FC = () => {
  const documents = [
    { documentName: 'Dokumentacja 1', date: '12.12.2024' },
    { documentName: 'Dokumentacja 2', date: '12.12.2024' },
    { documentName: 'Dokumentacja 3', date: '12.12.2024' },
  ];

  return (
    <div className={styles.documents}>
      <h2>Lista dokumentacji</h2>
      <table className={styles.documentsTable}>
        <thead>
          <tr>
            <th>Nazwa dokumentacji</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document, index) => (
            <tr key={index}>
              <td>{document.documentName}</td>
              <td>{document.date}</td>
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

export default DocumentationList;
