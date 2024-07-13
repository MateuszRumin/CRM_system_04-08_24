import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Drawer, Button, Typography, Box, IconButton } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import styles from './EmployeeDetails.module.css';
import CalendarIcon from '../../assets/EmployeePage/calendar_drawer.svg';
import ExaxmpleProfilePicture from '../../assets/EmployeePage/example_profile_picture.svg';
import jsPDF from 'jspdf';

export function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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
    const doc = new jsPDF();
    const text = `
      Imię: ${employee.name.split(' ')[0]}
      Nazwisko: ${employee.name.split(' ')[1]}
      Umowa: ${employee.contract}
      Data: ${selectedDate ? format(selectedDate, 'dd.MM.yyyy') : 'Nie wybrano daty'}
      Miesiąc: ${selectedDate ? format(selectedDate, 'MMMM') : 'Nie wybrano miesiąca'}
      Liczba przepracowanych godzin w miesiącu: 250
      Liczba przepracowanych godzin w danym dniu: 24
    `;
    doc.text(text, 10, 10);
    doc.save('employee_details.pdf');
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
              <button className={styles.projectButton}>Projekt 1</button>
              <button className={styles.projectButton}>Projekt 2</button>
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
