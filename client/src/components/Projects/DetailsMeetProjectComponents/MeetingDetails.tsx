import React from 'react';
import axios from 'axios';
import styles from './MeetingDetails.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface MeetingDetailsProps {
  meetingId: number;
  onClose: () => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ meetingId, onClose }) => {
  const [meetingDetails, setMeetingDetails] = React.useState<any>(null); // Zastąp `any` bardziej szczegółowym typem, jeśli masz
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await axios.get(`${apiServerUrl}/projects/meeting/${meetingId}`);
        setMeetingDetails(response.data);
      } catch (err) {
        setError('Failed to fetch meeting details');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();
  }, [meetingId]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${apiServerUrl}/projects/meeting/${meetingId}`);
      console.log(response.data.message); // Potwierdzenie usunięcia
      onClose(); // Zamknięcie szczegółów po usunięciu
    } catch (err) {
      setError('Failed to delete meeting');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.meetingDetailsContainer}>
      <h2>Szczegóły Spotkania</h2>
      {meetingDetails && (
        <div className={styles.meetingDetails}>
          <p><strong>Nazwa spotkania:</strong> {meetingDetails.ProjectMeeting[0].Project.name}</p>
          <p><strong>Czas spędzony:</strong> {meetingDetails.time_spent} min</p>
          <p><strong>Data:</strong> {new Date(meetingDetails.date).toLocaleDateString()}</p>
          <p><strong>Link do spotkania:</strong> <a href={meetingDetails.meeting_link} target="_blank" rel="noopener noreferrer">{meetingDetails.meeting_link}</a></p>
          <p><strong>Opis spotkania:</strong> {meetingDetails.meeting_description}</p>
          <p><strong>Wyniki spotkania:</strong> {meetingDetails.meeting_outcomes}</p>
        </div>
      )}
      <div className={styles.formButtons}>
        {/* <button className={styles.deleteButton} onClick={handleDelete}>Usuń Spotkanie</button> */}
        <button className={styles.closeButton} onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default MeetingDetails;
