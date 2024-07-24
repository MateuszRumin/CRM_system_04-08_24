import React from 'react';
import styles from './MettingsList.module.css';

interface Props {
  onAddMeeting: () => void;
}

const MeetingsList: React.FC<Props> = ({ onAddMeeting }) => {
  const meetings = [
    {
      projectName: 'Spotkanie A',
      timeSpent: 'Adam Nowak',
      date: '12.12.2024',
    },
    {
      projectName: 'Spotkanie B',
      timeSpent: 'Adam Nowak',
      date: '12.12.2024',
    },
    {
      projectName: 'Spotkanie C',
      timeSpent: 'Anna Kowalska',
      date: '14.12.2024',
    },
    {
      projectName: 'Spotkanie D',
      timeSpent: 'Jan Kowalski',
      date: '15.12.2024',
    },
    {
      projectName: 'Spotkanie E',
      timeSpent: 'Ewa Nowak',
      date: '16.12.2024',
    },
    {
      projectName: 'Spotkanie F',
      timeSpent: 'Krzysztof Kowalski',
      date: '17.12.2024',
    },
  ];

  return (
    <div className={styles.meetings}>
      <h2>Lista spotkań z klientem</h2>
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
          {meetings.map((meeting, index) => (
            <tr key={index}>
              <td>{meeting.projectName}</td>
              <td>{meeting.timeSpent}</td>
              <td>{meeting.date}</td>
              <td>
                <button className={styles.detailsButton}>Szczegóły</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAddMeeting} className={styles.addButton}>
        Dodaj
      </button>
    </div>
  );
};

export default MeetingsList;
