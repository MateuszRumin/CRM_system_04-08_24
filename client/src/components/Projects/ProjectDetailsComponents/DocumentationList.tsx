import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DocumentationList.module.css';
import { DocumentationModal } from '../DocumentationModalComponents/DocumentationModal';
import { AddDocumentationModal } from '../DocumentationModalComponents/AddDocumentationModal';
import { DeleteDocumentationModal } from '../DocumentationModalComponents/DeleteDocumentationModal';

const DocumentationList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/projects/${projectId}`)
      .then(response => {
        setDocuments(response.data.ProjectDoc);
      })
      .catch(error => {
        console.error('Error fetching documentation:', error);
      });
  }, [projectId]);

  const handleAddClick = () => setShowAddModal(true);
  const handleDetailsClick = (document: any) => {
    setSelectedDocument(document);
    setShowDetails(true);
  };
  const handleDeleteClick = (documentId: number) => {
    setDocumentToDelete(documentId);
    setShowDeleteModal(true);
  };

  const refreshDocuments = () => {
    axios.get(`http://localhost:3000/projects/${projectId}`)
      .then(response => {
        setDocuments(response.data.ProjectDoc);
      })
      .catch(error => {
        console.error('Error refreshing documentation:', error);
      });
  };

  return (
    <div className={styles.documentationList}>
      <h2>Lista dokumentacji</h2>
      <table className={styles.documentsTable}>
        <thead>
          <tr>
            <th>Nazwa dokumentacji</th>
            <th>Opis</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.project_doc_id}>
              <td>{doc.file_name}</td>
              <td>{doc.doc_description}</td>
              <td>
                <button onClick={() => handleDetailsClick(doc)} className={styles.detailsButton}>Szczegóły</button>
                <button onClick={() => handleDeleteClick(doc.project_doc_id)} className={styles.deleteButton}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddClick} className={styles.addButton}>Dodaj</button>

      {/* Modals */}
      {showDetails && selectedDocument && (
        <DocumentationModal
          document={selectedDocument}
          onClose={() => setShowDetails(false)}
        />
      )}
      {showAddModal && (
        <AddDocumentationModal
          projectId={projectId}
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            setShowAddModal(false);
            refreshDocuments();
          }}
        />
      )}
      {showDeleteModal && documentToDelete !== null && (
        <DeleteDocumentationModal
          documentId={documentToDelete}
          projectId={projectId}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            setShowDeleteModal(false);
            refreshDocuments();
          }}
        />
      )}
    </div>
  );
};

export default DocumentationList;
