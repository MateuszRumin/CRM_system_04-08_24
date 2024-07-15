import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProjectDetails.module.css'
import { RepositoryModal } from '../../components/Projects/ProjectModalComponents/RepositoryModal';
import { FigmaModal } from '../../components/Projects/ProjectModalComponents/FigmaModal';
import MeetingsList from '../../components/Projects/ProjectDetailsComponents/MettingsList';
import TasksList from '../../components/Projects/ProjectDetailsComponents/TaskList';
import InvoicesList from '../../components/Projects/ProjectDetailsComponents/InvoicesList';
import DocumentationList from '../../components/Projects/ProjectDetailsComponents/DocumentationList';
import ContractsList from '../../components/Projects/ProjectDetailsComponents/ContractsList';

export const ProjectDetails: React.FC = () => {
  const location = useLocation();
  const project = location.state?.project;

  const [repositoryModalVisible, setRepositoryModalVisible] = useState(false);
  const [figmaModalVisible, setFigmaModalVisible] = useState(false);

  const handleAddMeeting = () => {
    console.log('test dodania');
  };

  const handleRepositoryLinkButtonClick = () => {
    setRepositoryModalVisible(true);
  };

  const handleFigmaLinkButtonClick = () => {
    setFigmaModalVisible(true);
  };

  const handleCloseRepositoryModal = () => {
    setRepositoryModalVisible(false);
  };

  const handleCloseFigmaModal = () => {
    setFigmaModalVisible(false);
  };

  const handleSaveRepositoryLink = (link: string) => {
    console.log('Zapisano link do repozytorium:', link);
    setRepositoryModalVisible(false);
  };

  const handleSaveFigmaLink = (link: string) => {
    console.log('Zapisano link do figmy:', link);
    setFigmaModalVisible(false);
  };

  return (
    <div className={styles.detailsContainer}>
      <h1>Szczegóły projektu {project.name} o id: {project.id}</h1>
      <div className={styles.projectInfo}>
      <div>
        <h2>Nazwa Usługi: {project?.name}</h2>
        <p>Nazwa klienta: {project?.client}</p>
        <p>Status: {project?.status}</p>
        <p>Termin wykonania: {project?.endDate}</p>
      </div>
      <div>
        <h2>Kontakt z klientem</h2>
        <p>Imię i nazwisko: Adam Nowak</p>
        <p>Adres: Kraków, Lwowska 10</p>
        <p>Numer telefonu: 575637463</p>
      </div>
    </div>
      <div className={styles.projectLinks}>
        <button onClick={handleRepositoryLinkButtonClick}>Link do repozytorium</button>
        <button onClick={handleFigmaLinkButtonClick}>Link do Figmy</button>
      </div>
      <div className={styles.additionalInfo}>
        <div className={styles.meetingsAndTasks}>
          <MeetingsList onAddMeeting={handleAddMeeting} />
          <TasksList />
        </div>
        <div className={styles.invoicesDocumentationContracts}>
          <InvoicesList />
          <DocumentationList />
          <ContractsList />
        </div>
      </div>

      {/* Modals */}
      <RepositoryModal visible={repositoryModalVisible} onClose={handleCloseRepositoryModal} onSave={handleSaveRepositoryLink} />
      <FigmaModal visible={figmaModalVisible} onClose={handleCloseFigmaModal} onSave={handleSaveFigmaLink} />
    </div>
  );
};