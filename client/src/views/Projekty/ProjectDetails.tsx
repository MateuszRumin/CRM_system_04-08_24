import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import axios from 'axios'; // Import axios
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

interface Project {
  project_id: number;
  name: string;
  Client: {
    first_name: string;
    second_name: string;
    address: string;
    ClientEmail: {
      email: string;
    }[];
    ClientPhone: {
      phone: number;
    }[];
  };
  Status: {
    name: string;
  };
  endDate: string;
  ProjectTask: any[];
  ProjectMeeting: any[];
}

export const ProjectDetails: React.FC = () => {
  const location = useLocation();
  const projectId = location.state?.project?.project_id; // Use project_id from location state

  const [project, setProject] = useState<Project | null>(null);
  const [meetingsDrawerVisible, setMeetingsDrawerVisible] = useState(false);
  const [tasksDrawerVisible, setTasksDrawerVisible] = useState(false);

  useEffect(() => {
    if (projectId) {
      axios.get(`http://localhost:3000/projects/${projectId}`)
        .then(response => {
          setProject(response.data);
        })
        .catch(error => {
          console.error('Error fetching project data:', error);
        });
    }
  }, [projectId]);

  const toggleMeetingsDrawer = () => {
    setMeetingsDrawerVisible(!meetingsDrawerVisible);
  };

  const toggleTasksDrawer = () => {
    setTasksDrawerVisible(!tasksDrawerVisible);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.headerContainer}>
        <h1>Szczegóły projektu {project.name} o id: {project.project_id}</h1>
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
          <h2>Nazwa Usługi: {project.name || 'Brak nazwy'}</h2>
          <p>Nazwa klienta: {project.Client.first_name || 'Brak'} {project.Client.second_name || 'Danych'}</p>
          <p>Status: {project.Status.name || 'Brak statusu'}</p>
          <p>Termin wykonania: {project.endDate || 'Brak daty'}</p>
        </div>
        <div>
          <h2>Kontakt z klientem</h2>
          <p>Imię i nazwisko: {project.Client.first_name} {project.Client.second_name}</p>
          <p>Adres: {project.Client.address}</p>
          <p>Adres e-mail: {project.Client.ClientEmail.map(email => email.email).join(', ')}</p>
          <p>Numer telefonu: {project.Client.ClientPhone.map(phone => phone.phone).join(', ')}</p>
        </div>
      </div>
      <div className={styles.projectLinks}>
        <RepositoryModal projectId={project.project_id} />
        <FigmaModal projectId={project.project_id} />
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
        <MeetingsList projectId={project.project_id} />
      </Drawer>
      <Drawer
        anchor="right"
        open={tasksDrawerVisible}
        onClose={toggleTasksDrawer}
        PaperProps={{
          style: { width: '38.00%' }
        }}
      >
        <TasksList projectId={project.project_id} />
      </Drawer>
    </div>
  );
};
