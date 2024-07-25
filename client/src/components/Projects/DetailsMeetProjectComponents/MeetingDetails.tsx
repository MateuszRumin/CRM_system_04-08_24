import React from 'react';
import styles from './MeetingDetails.module.css';

interface MeetingDetailsProps {
  meeting: any;
  onClose: () => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ meeting, onClose }) => {
  return (
    <div className={styles.meetingDetailsContainer}>
      <h2>Szczegóły Spotkania</h2>
      <div className={styles.meetingDetails}>
        <p><strong>Nazwa spotkania:</strong> {meeting.projectName}</p>
        <p><strong>Czas spędzony:</strong> {meeting.timeSpent}</p>
        <p><strong>Data:</strong> {meeting.date}</p>
        <p><strong>Link do spotkania:</strong> <a href={meeting.link} target="_blank" rel="noopener noreferrer">{meeting.link}</a></p>
        <p><strong>Opis spotkania:</strong> {meeting.description}</p>
      </div>
      <div className={styles.formButtons}>
        <button className={styles.closeButton} onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default MeetingDetails;
