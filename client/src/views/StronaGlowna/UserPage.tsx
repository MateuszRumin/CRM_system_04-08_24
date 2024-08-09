import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserPage.module.css';

interface Project {
  project_id: number;
  name: string;
  description: string;
  ProjectLink: Array<{
    link_id: number;
    link_type: string;
    link: string;
  }>;
  Client: {
    client_id: number;
    first_name: string;
    second_name: string;
    company_name: string;
    address: string;
    ClientPhone: Array<{
      phone_id: number;
      client_id: number;
      tel_number: string;
    }>;
    ClientEmail: Array<{
      email_id: number;
      client_id: number;
      email: string;
    }>;
  };
  Status: {
    status_id: number;
    status_type: string;
    name: string;
  };
  ProjectDetail: Array<{
    deadline: string;
    cost: number;
  }>;
  ProjectTask: Array<{
    Task: {
      task_id: number;
      task_name: string;
      deadline: string;
      Status: {
        status_id: number;
        status_type: string;
        default: boolean;
        name: string;
      };
    };
  }>;
  ProjectDoc: Array<{
    project_doc_id: number;
    file_name: string;
    doc_description: string;
    ProjectLink: {
      link_id: number;
      link: string;
    };
  }>;
  ProjectMeeting: Array<{
    project_meeting_id: number;
    meeting_id: number;
    project_id: number;
    Meeting: {
      time_spent: number;
      date: string;
    };
    Project: {
      name: string;
    };
  }>;
  ProjectAssignment: Array<{
    User: {
      UserData: Array<{
        user_id: number;
        first_name: string;
        second_name: string;
        Position: {
          name: string;
        };
      }>;
    };
  }>;
}

interface MeetingDetails {
  meeting_id: number;
  date: string;
  time_spent: number;
  meeting_description: string;
  meeting_outcomes: string;
  meeting_link: string;
  ProjectMeeting: Array<{
    Project: {
      project_id: number;
      name: string;
      client_id: number;
      status_id: number;
      description: string;
      created_at: string;
      updated_at: string;
    };
  }>;
}

export const UserPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('USER') || '{}');
        const userId = user.userId;

        if (userId) {
          const response = await axios.get(`http://localhost:3000/employees/${userId}`);
          const projectAssignments = response.data.ProjectAssignment;
          const projectIds = projectAssignments.map((assignment: any) => assignment.project_id);

          const projectDetailsPromises = projectIds.map((id: number) => axios.get(`http://localhost:3000/projects/${id}`));
          const projectDetailsResponses = await Promise.all(projectDetailsPromises);

          const fetchedProjects = projectDetailsResponses.map((res) => res.data);
          setProjects(fetchedProjects);

          if (fetchedProjects.length > 0) {
            setSelectedProject(fetchedProjects[0]);
            fetchMeetingDetails(fetchedProjects[0].project_id);
          }
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setMeetingDetails(null);  // Clear the previous meeting details
      fetchMeetingDetails(selectedProject.project_id);
    }

    async function fetchMeetingDetails(projectId: number) {
      try {
        const response = await axios.get(`http://localhost:3000/projects/meeting/${projectId}`);
        if (response.data && response.data.meeting_id) {
          setMeetingDetails(response.data);
        } else {
          setMeetingDetails(null);
        }
      } catch (error) {
        console.error('Error fetching meeting details:', error);
        setMeetingDetails(null);
      }
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.userPageContainer}>
      <h1>Strona Główna</h1>

      <div className={styles.projectSwitcher}>
        <h3>Wybierz projekt:</h3>
        <select onChange={(e) => setSelectedProject(projects.find(p => p.project_id === +e.target.value) || null)} className={styles.projectSelect}>
          {projects.map(project => (
            <option key={project.project_id} value={project.project_id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <>
          <div className={styles.topSection}>
            <div className={styles.projectData}>
              <h2>Projekt: {selectedProject.name}</h2>
              <p>{selectedProject.description}</p>

              <div className={styles.projectLinks}>
                <h3>Linki</h3>
                <ul>
                  {selectedProject.ProjectLink.map((link) => (
                    <li key={link.link_id}>
                      <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link_type}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.clientData}>
              <h3>Klient</h3>
              <p>{selectedProject.Client.company_name}</p>
              <p>{selectedProject.Client.address}</p>
              <p>Kontakt:</p>
              <ul>
                {selectedProject.Client.ClientPhone.map((phone) => (
                  <li key={phone.phone_id}>{phone.tel_number}</li>
                ))}
              </ul>
              <ul>
                {selectedProject.Client.ClientEmail.map((email) => (
                  <li key={email.email_id}>{email.email}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.projectTasks}>
              <h3>Zadania</h3>
              <ul>
                {selectedProject.ProjectTask.map((task) => (
                  <li key={task.Task.task_id}>
                    <strong>{task.Task.task_name}</strong> (Termin: {new Date(task.Task.deadline).toLocaleDateString()}) - Status: {task.Task.Status.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.projectDocs}>
              <h3>Dokumentacja</h3>
              <ul>
                {selectedProject.ProjectDoc.map((doc) => (
                  <li key={doc.project_doc_id}>
                    <a href={doc.ProjectLink.link} target="_blank" rel="noopener noreferrer">{doc.file_name}</a> - {doc.doc_description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {meetingDetails && (
        <div className={styles.meetingDetails}>
          <h3>Spotkanie</h3>
          <p><strong>Data:</strong> {new Date(meetingDetails.date).toLocaleString()}</p>
          <p><strong>Czas trwania:</strong> {meetingDetails.time_spent} minut</p>
          <p><strong>Opis:</strong> {meetingDetails.meeting_description}</p>
          <p><strong>Rezultaty:</strong> {meetingDetails.meeting_outcomes}</p>
          <p><strong>Link do spotkania:</strong> <a href={meetingDetails.meeting_link} target="_blank" rel="noopener noreferrer">{meetingDetails.meeting_link}</a></p>
        </div>
      )}

      {!meetingDetails && (
        <div className={styles.meetingDetails}>
          <h3>Brak zaplanowanych spotkań dla tego projektu.</h3>
        </div>
      )}
    </div>
  );
}

export default UserPage;