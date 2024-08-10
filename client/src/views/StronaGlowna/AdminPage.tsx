import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css';
import Pagination from './Pagination';

interface WorkSession {
    session_id: number;
    user_id: number;
    token: string;
    active: boolean;
    startTime: string;
    endTime?: string;
    User: {
        user_id: number;
        username: string;
        email: string;
        UserRole: Array<{
            user_role_id: number;
            user_id: number;
            role_id: number;
            Role: {
                role_id: number;
                name: string;
            };
        }>;
    };
}

interface MonthYear {
    year: number;
    month: number;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15];

const calculateTimeWorked = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = end.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} godz. ${minutes} min.`;
};

export const AdminPage = () => {
    const [activeSessions, setActiveSessions] = useState<WorkSession[]>([]);
    const [endedSessions, setEndedSessions] = useState<WorkSession[]>([]);
    const [currentPageActive, setCurrentPageActive] = useState<number>(1);
    const [itemsPerPageActive, setItemsPerPageActive] = useState<number>(ITEMS_PER_PAGE_OPTIONS[0]);
    const [currentPageEnded, setCurrentPageEnded] = useState<number>(1);
    const [itemsPerPageEnded, setItemsPerPageEnded] = useState<number>(ITEMS_PER_PAGE_OPTIONS[0]);
    const [selectedMonthYear, setSelectedMonthYear] = useState<string>('');
    const [monthsAndYears, setMonthsAndYears] = useState<MonthYear[]>([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/employees/session/workSessions');
                const { activeSessions, endedSessions } = response.data;
                setActiveSessions(activeSessions);
                setEndedSessions(endedSessions);

                // Extract unique months and years from the fetched sessions
                const sessions = [...activeSessions, ...endedSessions];
                const monthsAndYears = sessions.reduce((acc: { year: number; month: number }[], session) => {
                    const date = new Date(session.startTime);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1; // getMonth() returns 0-based month

                    // Add unique year-month combinations
                    if (!acc.some(item => item.year === year && item.month === month)) {
                        acc.push({ year, month });
                    }

                    return acc;
                }, []);

                setMonthsAndYears(monthsAndYears);
            } catch (error) {
                console.error('Error fetching work sessions:', error);
            }
        };

        fetchSessions();

        // Update time every minute
        const intervalId = setInterval(() => {
            setActiveSessions(prevSessions => 
                prevSessions.map(session => ({
                    ...session,
                    timeWorked: calculateTimeWorked(session.startTime)
                }))
            );
        }, 1 * 60 * 1000); // 1 minute

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const getRoleName = (userRole: { Role: { name: string } }[]) => {
        return userRole.length > 0 ? userRole[0].Role.name : 'Unknown';
    };

    const indexOfLastSessionActive = currentPageActive * itemsPerPageActive;
    const indexOfFirstSessionActive = indexOfLastSessionActive - itemsPerPageActive;
    const currentActiveSessions = activeSessions.slice(indexOfFirstSessionActive, indexOfLastSessionActive);

    const indexOfLastSessionEnded = currentPageEnded * itemsPerPageEnded;
    const indexOfFirstSessionEnded = indexOfLastSessionEnded - itemsPerPageEnded;
    const currentEndedSessions = endedSessions.slice(indexOfFirstSessionEnded, indexOfLastSessionEnded);

    const totalActiveSessions = activeSessions.length;
    const totalEndedSessions = endedSessions.length;

    const paginateActive = (pageNumber: number) => setCurrentPageActive(pageNumber);
    const changeItemsPerPageActive = (newItemsPerPage: number) => setItemsPerPageActive(newItemsPerPage);

    const paginateEnded = (pageNumber: number) => setCurrentPageEnded(pageNumber);
    const changeItemsPerPageEnded = (newItemsPerPage: number) => setItemsPerPageEnded(newItemsPerPage);

    const handleEndSession = async (sessionId: number) => {
        try {
            await axios.post(`http://localhost:3000/employees/session/${sessionId}`);
            // Refresh sessions after ending
            const response = await axios.get('http://localhost:3000/employees/session/workSessions');
            const { activeSessions, endedSessions } = response.data;
            setActiveSessions(activeSessions);
            setEndedSessions(endedSessions);
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    const handleDeleteSession = async (sessionId: number) => {
        try {
            await axios.delete(`http://localhost:3000/employees/session/${sessionId}`);
            // Refresh sessions after deletion
            const response = await axios.get('http://localhost:3000/employees/session/workSessions');
            const { activeSessions, endedSessions } = response.data;
            setActiveSessions(activeSessions);
            setEndedSessions(endedSessions);
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const handleDeleteSessionsByMonth = async () => {
        if (!selectedMonthYear) {
            alert('Please select a month and year.');
            return;
        }

        const [year, month] = selectedMonthYear.split('-').map(Number);

        try {
            await axios.delete('http://localhost:3000/employees/session/deleteByMonth', {
                data: {
                    month: month.toString().padStart(2, '0'), // Ensure format "MM"
                    year: year.toString()                      // Ensure format "YYYY"
                }
            });

            // Refresh sessions after deletion
            const response = await axios.get('http://localhost:3000/employees/session/workSessions');
            const { activeSessions, endedSessions } = response.data;
            setActiveSessions(activeSessions);
            setEndedSessions(endedSessions);
        } catch (error) {
            console.error('Error deleting sessions by month:', error);
        }
    };

    return (
        <div className={styles.adminPageContainer}>
            <h1>Panel Administratora</h1>

            <div className={styles.dateRangeContainer}>
                <h2>Usuń zakończone sesje pracowników według miesiąca</h2>
                <div className={styles.dateRangeForm}>
                    <label htmlFor="monthYear">Wybierz miesiąc:</label>
                    <select
                        id="monthYear"
                        value={selectedMonthYear}
                        onChange={(e) => setSelectedMonthYear(e.target.value)}
                    >
                        <option value="">-- Wybierz miesiąc --</option>
                        {monthsAndYears.map(({ year, month }) => (
                            <option key={`${year}-${month}`} value={`${year}-${month}`}>
                                {`${month < 10 ? `0${month}` : month}-${year}`}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleDeleteSessionsByMonth} className={styles.deleteButton}>
                        Usuń sesje
                    </button>
                </div>
            </div>

            <div className={styles.sessionsContainer}>
                <div className={styles.sessionsSection}>
                    <h2>Aktywne sesje pracowników</h2>
                    {currentActiveSessions.length > 0 ? (
                        <ul>
                            {currentActiveSessions.map(session => (
                                <li key={session.session_id} className={styles.activeSession}>
                                    <p><strong>Użytkownik:</strong> {session.User.username}</p>
                                    <p><strong>Rola:</strong> {getRoleName(session.User.UserRole)}</p>
                                    <p><strong>Start:</strong> {new Date(session.startTime).toLocaleString()}</p>
                                    <p><strong>Czas pracy:</strong> {calculateTimeWorked(session.startTime)}</p>
                                    <button onClick={() => handleEndSession(session.session_id)} className={styles.endButton}>
                                        Zakończ sesję
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak aktywnych sesji.</p>
                    )}
                    <Pagination
                        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                        itemsPerPage={itemsPerPageActive}
                        totalItems={totalActiveSessions}
                        currentPage={currentPageActive}
                        paginate={paginateActive}
                        changeItemsPerPage={changeItemsPerPageActive}
                    />
                </div>

                <div className={styles.sessionsSection}>
                    <h2>Zakończone sesje pracowników</h2>
                    {currentEndedSessions.length > 0 ? (
                        <ul>
                            {currentEndedSessions.map(session => (
                                <li key={session.session_id} className={styles.endedSession}>
                                    <p><strong>Użytkownik: </strong> {session.User.username}</p>
                                    <p><strong>Rola: </strong> {getRoleName(session.User.UserRole)}</p>
                                    <p><strong>Start:</strong> {new Date(session.startTime).toLocaleString()}</p>
                                    <p><strong>End:</strong> {session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A'}</p>
                                    <p><strong>Czas pracy:</strong> {session.endTime ? calculateTimeWorked(session.startTime, session.endTime) : 'N/A'}</p>
                                    <button onClick={() => handleDeleteSession(session.session_id)} className={styles.deleteButton}>
                                        Usuń
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak zakończonych sesji.</p>
                    )}
                    <Pagination
                        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                        itemsPerPage={itemsPerPageEnded}
                        totalItems={totalEndedSessions}
                        currentPage={currentPageEnded}
                        paginate={paginateEnded}
                        changeItemsPerPage={changeItemsPerPageEnded}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;