import React, { useState } from 'react';
import styles from './MettingsList.module.css';
import MeetingForm from '../AddNewProjectMeetComponents/MeetingForm';
import MeetingDetails from '../DetailsMeetProjectComponents/MeetingDetails';

const meetingsData = [
  {
    id: 1,
    projectName: 'Spotkanie A',
    timeSpent: '1h',
    date: '12.12.2024',
    link: 'http://meeting-a.com',
    description: 'Opis spotkania A',
  },
  {
    id: 2,
    projectName: 'Spotkanie B',
    timeSpent: '2h',
    date: '13.12.2024',
    link: 'http://meeting-b.com',
    description: 'Opis spotkania B',
  },
];

const MeetingsList: React.FC = () => {
  const [meetings, setMeetings] = useState(meetingsData);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [view, setView] = useState<'list' | 'details' | 'edit' | 'add'>('list');

  const handleAddMeeting = () => {
    setSelectedMeeting(null);
    setView('add');
  };

  const handleEditMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setView('edit');
  };

  const handleViewMeetingDetails = (meeting: any) => {
    setSelectedMeeting(meeting);
    setView('details');
  };

  const handleDeleteMeeting = (meetingId: number) => {
    setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
    setView('list');
  };

  const handleSaveMeeting = (meeting: any) => {
    if (selectedMeeting) {
      setMeetings(meetings.map(m => (m.id === meeting.id ? meeting : m)));
    } else {
      setMeetings([...meetings, { ...meeting, id: meetings.length + 1 }]);
    }
    setView('list');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
    <div className={styles.meetings}>
      <h2>Lista spotkań z klientem</h2>
      {view === 'list' && (
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
              {meetings.map((meeting, index) => (
                <tr key={index}>
                  <td>{meeting.projectName}</td>
                  <td>{meeting.timeSpent}</td>
                  <td>{meeting.date}</td>
                  <td>
                    <button className={styles.detailsButton} onClick={() => handleViewMeetingDetails(meeting)}>Szczegóły</button>
                    <button className={styles.editButton} onClick={() => handleEditMeeting(meeting)}>Edytuj</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteMeeting(meeting.id)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddMeeting} className={styles.addButton}>Dodaj</button>
        </>
      )}
      {view === 'details' && selectedMeeting && (
        <MeetingDetails meeting={selectedMeeting} onClose={handleBackToList} />
      )}
      {(view === 'edit' || view === 'add') && (
        <MeetingForm meeting={selectedMeeting} onSave={handleSaveMeeting} onCancel={handleBackToList} />
      )}
    </div>
  );
};

export default MeetingsList;
