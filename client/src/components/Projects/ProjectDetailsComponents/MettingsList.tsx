import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MettingsList.module.css';
import MeetingForm from '../AddNewProjectMeetComponents/MeetingForm';
import MeetingDetails from '../DetailsMeetProjectComponents/MeetingDetails';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface Meeting {
  meeting_id: number;
  project_id: number;
  Meeting: {
    time_spent: number;
    date: string;
    meeting_description?: string;
    meeting_link?: string;
    meeting_outcomes?: string;
  };
  Project: {
    name: string;
  };
}

interface MeetingsListProps {
  projectId: number | undefined;
}

const MeetingsList: React.FC<MeetingsListProps> = ({ projectId }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'edit' | 'add'>('list');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId !== undefined) {
      const fetchMeetings = async () => {
        try {
          const response = await axios.get(`${apiServerUrl}/projects/${projectId}`);
          setMeetings(response.data.ProjectMeeting);
        } catch (err) {
          setError('Failed to fetch meetings');
        } finally {
          setLoading(false);
        }
      };
  
      fetchMeetings();
    }
  }, [projectId]);

  const handleAddMeeting = () => {
    setSelectedMeeting(null);
    setView('add');
  };

  const handleEditMeeting = async (meeting: Meeting) => {
    try {
      const response = await axios.get(`${apiServerUrl}/projects/meeting/${meeting.meeting_id}`);
      setSelectedMeeting(response.data);
      setView('edit');
    } catch (err) {
      setError('Failed to fetch meeting details');
    }
  };

  const handleViewMeetingDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setView('details');
  };

  const handleDeleteMeeting = async (meetingId: number) => {
    try {
      const response = await axios.delete(`${apiServerUrl}/projects/meeting/${meetingId}`);
      console.log(response.data.message); // Potwierdzenie usunięcia
      setMeetings(meetings.filter(meeting => meeting.meeting_id !== meetingId));
      setView('list');
    } catch (err) {
      setError('Failed to delete meeting');
    }
  };

  const handleSaveMeeting = (updatedMeeting: Meeting) => {
    if (selectedMeeting) {
      // Update existing meeting
      setMeetings(meetings.map(meeting => (meeting.meeting_id === updatedMeeting.meeting_id ? updatedMeeting : meeting)));
    } else {
      // Add new meeting
      setMeetings([...meetings, { ...updatedMeeting, meeting_id: meetings.length + 1 }]);
    }
    setView('list');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
    <div className={styles.meetings}>
      <h2>Lista spotkań z klientem</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {view === 'list' && !loading && !error && (
        <>
          <table className={styles.meetingsTable}>
            <thead>
              <tr>
                <th>Nazwa spotkania</th>
                <th>Czas spędzony</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(meeting => (
                <tr key={meeting.meeting_id}>
                  <td>{meeting.Project ? meeting.Project.name : 'Brak nazwy'}</td>
                  <td>{meeting.Meeting ? meeting.Meeting.time_spent : 'Brak danych'}</td>
                  <td>{meeting.Meeting ? new Date(meeting.Meeting.date).toLocaleDateString() : 'Brak daty'}</td>
                  <td>
                    <button className={styles.detailsButton} onClick={() => handleViewMeetingDetails(meeting)}>Szczegóły</button>
                    <button className={styles.editButton} onClick={() => handleEditMeeting(meeting)}>Edytuj</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteMeeting(meeting.meeting_id)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddMeeting} className={styles.addButton}>Dodaj</button>
        </>
      )}
      {view === 'details' && selectedMeeting && (
        <MeetingDetails meetingId={selectedMeeting.meeting_id} onClose={handleBackToList} />
      )}
      {(view === 'edit' || view === 'add') && (
        <MeetingForm meeting={selectedMeeting} projectId={projectId} onSave={handleSaveMeeting} onCancel={handleBackToList} />
      )}
    </div>
  );
};

export default MeetingsList;
