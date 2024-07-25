import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import styles from './ProjectDetails.module.css';
import { RepositoryModal } from '../../components/Projects/ProjectModalComponents/RepositoryModal';
import { FigmaModal } from '../../components/Projects/ProjectModalComponents/FigmaModal';
import MeetingsList from '../../components/Projects/ProjectDetailsComponents/MettingsList';
import TasksList from '../../components/Projects/ProjectDetailsComponents/TaskList';
import InvoicesList from '../../components/Projects/ProjectDetailsComponents/InvoicesList';
import DocumentationList from '../../components/Projects/ProjectDetailsComponents/DocumentationList';
import ContractsList from '../../components/Projects/ProjectDetailsComponents/ContractsList';
import MettingListButtonDrawer from '../../assets/ProjectPage/meeting_icon.svg';
import TaskListButtonDrawer from '../../assets/ProjectPage/task-square-svgrepo-com.svg';

export const ProjectDetails: React.FC = () => {
  const location = useLocation();
  const project = location.state?.project;

  const [meetingsDrawerVisible, setMeetingsDrawerVisible] = useState(false);
  const [tasksDrawerVisible, setTasksDrawerVisible] = useState(false);

  const toggleMeetingsDrawer = () => {
    setMeetingsDrawerVisible(!meetingsDrawerVisible);
  };

  const toggleTasksDrawer = () => {
    setTasksDrawerVisible(!tasksDrawerVisible);
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.headerContainer}>
        <h1>Szczegóły projektu {project?.name} o id: {project?.project_id}</h1>
        <div className={styles.meetingsAndTasks}>
          <IconButton onClick={toggleMeetingsDrawer} className={styles.drawerButton}>
            <img src={MettingListButtonDrawer} alt="Open Meetings" />
          </IconButton>
          <IconButton onClick={toggleTasksDrawer} className={styles.drawerButton}>
            <img src={TaskListButtonDrawer} alt="Open Tasks" />
          </IconButton>
        </div>
      </div>
      <div className={styles.projectInfo}>
        <div>
          <h2>Nazwa Usługi: {project?.name || 'Brak nazwy'}</h2>
          <p>Nazwa klienta: {project?.client?.first_name || 'Brak'} {project?.client?.second_name || 'Danych'}</p>
          <p>Status: {project?.status?.name || 'Brak statusu'}</p>
          <p>Termin wykonania: {project?.endDate || 'Brak daty'}</p>
        </div>
        <div>
          <h2>Kontakt z klientem</h2>
          <p>Imię i nazwisko: Adam Nowak</p>
          <p>Adres: Kraków, Lwowska 10</p>
          <p>Numer telefonu: 575637463</p>
        </div>
      </div>
      <div className={styles.projectLinks}>
        <RepositoryModal projectId={project?.project_id} />
        <FigmaModal projectId={project?.project_id} />
      </div>
      <div className={styles.additionalInfo}>
        <div className={styles.invoicesDocumentationContracts}>
          <InvoicesList />
          <DocumentationList />
          <ContractsList />
        </div>
      </div>

      {/* Drawers */}
      <Drawer
        anchor="right"
        open={meetingsDrawerVisible}
        onClose={toggleMeetingsDrawer}
        PaperProps={{
          style: { width: '38.00%' }
        }}
      >
        <MeetingsList />
      </Drawer>
      <Drawer
        anchor="right"
        open={tasksDrawerVisible}
        onClose={toggleTasksDrawer}
        PaperProps={{
          style: { width: '38.00%' }
        }}
      >
        <TasksList />
      </Drawer>
    </div>
  );
};
