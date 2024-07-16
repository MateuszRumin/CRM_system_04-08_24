import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Drawer, Button, Typography, Box, IconButton } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import styles from './EmployeeDetails.module.css';
import CalendarIcon from '../../assets/EmployeePage/calendar_drawer.svg';
import ExaxmpleProfilePicture from '../../assets/EmployeePage/example_profile_picture.svg';
import jsPDF from 'jspdf';

interface Project {
  id: string;
  projectName: string;
}

export function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', projectName: 'Projekt A' },
    { id: '2', projectName: 'Projekt B' },
    { id: '3', projectName: 'Projekt C' },
    { id: '4', projectName: 'Projekt D' },
    { id: '5', projectName: 'Projekt E' },
    { id: '6', projectName: 'Projekt F' },
    { id: '7', projectName: 'Projekt G' },
    { id: '8', projectName: 'Projekt H' },
    { id: '9', projectName: 'Projekt I' },
    { id: '10', projectName: 'Projekt J' },
  ]); // Symulowane dane projektów

  // Przykładowe dane do generacji PDF-a w zależności od wybranego dnia
  const pdfDataByDate = [
    {
      date: new Date(2024, 7, 15), // 15 sierpnia 2024
      text: `
        Imię: ${employee?.name.split(' ')[0]}
        Nazwisko: ${employee?.name.split(' ')[1]}
        Umowa: ${employee?.contract}
        Data: 15.08.2024
        Miesiąc: Sierpień
        Liczba przepracowanych godzin w miesiącu: 250
        Liczba przepracowanych godzin w danym dniu: 24
      `,
    },
    {
      date: new Date(2024, 7, 20), // 20 sierpnia 2024
      text: `
        Imię: ${employee?.name.split(' ')[0]}
        Nazwisko: ${employee?.name.split(' ')[1]}
        Umowa: ${employee?.contract}
        Data: 20.08.2024
        Miesiąc: Sierpień
        Liczba przepracowanych godzin w miesiącu: 260
        Liczba przepracowanych godzin w danym dniu: 26
      `,
    },
    {
      date: new Date(2024, 8, 5), // 5 września 2024
      text: `
        Imię: ${employee?.name.split(' ')[0]}
        Nazwisko: ${employee?.name.split(' ')[1]}
        Umowa: ${employee?.contract}
        Data: 05.09.2024
        Miesiąc: Wrzesień
        Liczba przepracowanych godzin w miesiącu: 270
        Liczba przepracowanych godzin w danym dniu: 28
      `,
    },
  ];

  if (!employee) {
    return <div>Nie znaleziono szczegółów pracownika</div>;
  }

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleAssignProjectToEmployee = () => {
    navigate(`assign-project-to-employee`, { state: { employee } });
  };

  const handleRemoveEmployee = () => {
    navigate(`remove-employee`, { state: { employee } });
  };

  const handleDisplayProject = () => {
    console.log("tutaj będzie przejście do odpowiedniego projektu (jego id) za pomocą danych z API.");
  };

  const isAssignProjectRoute = location.pathname.includes('assign-project-to-employee');
  const isRemoveEmployeeRoute = location.pathname.includes('remove-employee');

  const handleModify = () => {
    const modifiedName = employee.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    navigate(`/pracownicy/edit-employee/${modifiedName}`, { state: { employee } });
  };

  const generatePDF = () => {
    if (!selectedDate) {
      return; // Brak wybranego dnia, nie generujemy PDF-a
    }

    const selectedDateString = format(selectedDate, 'dd.MM.yyyy');

    // Szukanie danych do generacji PDF-a na podstawie wybranego dnia
    const pdfData = pdfDataByDate.find((data) => format(data.date, 'dd.MM.yyyy') === selectedDateString);

    if (pdfData) {
      const doc = new jsPDF();
      doc.text(pdfData.text, 10, 10);
      doc.save('employee_details.pdf');
    } else {
      console.warn('Nie znaleziono danych do generacji PDF-a dla wybranego dnia.');
    }
  };

  return (
    <div className={styles.container}>
      {!isAssignProjectRoute && !isRemoveEmployeeRoute ? (
        <>
          <div className={styles.header}>
            <h1>Szczegóły pracownika - {employee.name}</h1>
            <IconButton onClick={toggleDrawer(true)} className={styles.calendarButton}>
              <img src={CalendarIcon} alt="Kalendarz" />
            </IconButton>
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.details}>
              <p><strong>Imię:</strong> {employee.name.split(' ')[0]}</p>
              <p><strong>Nazwisko:</strong> {employee.name.split(' ')[1]}</p>
              <p><strong>Umowa:</strong> {employee.contract}</p>
              <p><strong>Liczba przepracowanych godzin:</strong> {employee.hoursWorked}</p>
            </div>
            <div className={styles.imageContainer}>
              <h2>Zdjęcie pracownika</h2>
              <img src={ExaxmpleProfilePicture} alt={`Zdjęcie ${employee.name}`} className={styles.employeeImage} />
              <button onClick={handleModify} className={styles.modifyButton}>
                Modyfikuj pracownika
              </button>
              <button className={styles.deleteButton} onClick={handleRemoveEmployee}>
                Usuń pracownika
              </button>
            </div>
            <div className={styles.projectsContainer}>
              <h2>Projekty</h2>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectRow}>
                  <span className={styles.projectName}>{project.projectName}</span>
                  <button onClick={handleDisplayProject} className={styles.showButton}>Wyświetl</button>
                </div>
              ))}
              <button className={styles.addButton} onClick={handleAssignProjectToEmployee}>
                Dodaj
              </button>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box p={2} width={350}>
          <Typography variant="h6">Wybierz datę</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar date={selectedDate} onChange={handleDateChange} />
          </LocalizationProvider>
          <Box className={styles.dateInfo}>
            <Typography variant="body1">
              Data: {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : 'Nie wybrano daty'}
            </Typography>
            <Typography variant="body1">Liczba przepracowanych godzin: 24</Typography>
            <Typography variant="body1">
              Miesiąc: {selectedDate ? format(selectedDate, 'MMMM') : 'Nie wybrano miesiąca'}
            </Typography>
            <Typography variant="body1">Liczba przepracowanych godzin: 250</Typography>
            <Button variant="contained" color="primary" onClick={generatePDF}>
              Generuj PDF
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
