import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Drawer, Button, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import axios from 'axios';
import styles from './EmployeeDetails.module.css';
import CalendarIcon from '../../assets/EmployeePage/calendar_drawer.svg';
import ExaxmpleProfilePicture from '../../assets/EmployeePage/example_profile_picture.svg';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument } from 'pdf-lib';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface Project {
  project_id: string;
  name: string;
  client_id: string;
  status_id: string;
  created_at: string;
}

interface WorkSession {
  startTime: string;
  endTime: string;
}

export function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  const [hoursWorkedOnDate, setHoursWorkedOnDate] = useState<string>('');
  const [hoursWorkedInMonth, setHoursWorkedInMonth] = useState<string>('');
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  const [employeeName, setEmployeeName] = useState<string>('');

  const signatureRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (employee?.id) {
        try {
          const response = await axios.get(`${apiServerUrl}/employees/${employee.id}`);
          const employeeData = response.data;
          const firstName = employeeData.UserData[0]?.first_name || '';
          const lastName = employeeData.UserData[0]?.second_name || '';
          setEmployeeName(`${firstName} ${lastName}`);
        } catch (error) {
          console.error('Error fetching employee details:', error);
        }
      }
    };

    const fetchWorkSessions = async () => {
      try {
        const response = await axios.get(`${apiServerUrl}/employees/session/${employee?.id}`);
        setWorkSessions(response.data);
      } catch (error) {
        console.error('Error fetching work sessions:', error);
      }
    };
    

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiServerUrl}/projects/with/${employee?.id}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (employee) {
      fetchEmployeeDetails();
      fetchWorkSessions();
      fetchProjects();
    }
  }, [employee]);

  useEffect(() => {
    if (selectedDate && workSessions.length) {
      calculateWorkHours(selectedDate);
    }
  }, [selectedDate, workSessions]);

  const calculateWorkHours = (date: Date) => {
    if (!workSessions.length) return;

    const selectedDay = format(date, 'yyyy-MM-dd');
    const selectedMonth = format(date, 'yyyy-MM');

    let totalHoursOnDate = 0;
    let totalHoursInMonth = 0;

    workSessions.forEach((session) => {
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.warn('Invalid session time:', session);
        return;
      }

      const sessionDate = format(startTime, 'yyyy-MM-dd');
      const sessionMonth = format(startTime, 'yyyy-MM');

      if (sessionDate === selectedDay) {
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        totalHoursOnDate += hours;
      }

      if (sessionMonth === selectedMonth) {
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        totalHoursInMonth += hours;
      }
    });

    setHoursWorkedOnDate(totalHoursOnDate.toFixed(2) + ' h');
    setHoursWorkedInMonth(totalHoursInMonth.toFixed(2) + ' h');
  };

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
    navigate('assign-project-to-employee', { state: { employee } });
  };

  const handleRemoveEmployee = () => {
    navigate('remove-employee', { state: { employee } });
  };

  const handleDisplayProject = (projectId: string) => {
    console.log(`Przechodzę do projektu o ID: ${projectId}`);
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
        console.log("Brak wybranej daty, nie generujemy PDF-a");
        return;
    }

    const selectedDateString = format(selectedDate, 'dd.MM.yyyy');
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    // Funkcja przeliczająca godziny dziesiętne na godziny i minuty
    const convertToHoursAndMinutes = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours} h ${minutes} min`;
    };

    // Nowa tablica przechowująca rzeczywiste dane godzin pracy z pełnymi datami
    const tableData = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const displayDate = format(date, 'dd.MM.yyyy');

        // Znajdź sesje, które pasują do tego dnia
        const sessionForDay = workSessions.find(session =>
            format(new Date(session.startTime), 'yyyy-MM-dd') === formattedDate
        );

        // Jeśli znaleziono sesje, oblicz godziny pracy
        const hoursWorked = sessionForDay ?
            ((new Date(sessionForDay.endTime).getTime() - new Date(sessionForDay.startTime).getTime()) / (1000 * 60 * 60)) :
            0;

        // Przelicz godziny pracy na format godzin i minut
        const formattedHoursWorked = convertToHoursAndMinutes(hoursWorked);

        return [
            displayDate,  // Zamiast numeru dnia, wyświetlamy pełną datę
            formattedHoursWorked,
            signatureImage ? { content: signatureImage, type: 'image' } : '',
            ''
        ];
    });

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'unicode');

    doc.setDrawColor(233, 233, 233);
    doc.setFillColor(233, 233, 233);
    doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');

    doc.text(`Wykaz godzin:  ${employeeName}`, 15, 12);

    autoTable(doc, {
        head: [['Data', 'Ilosc godzin', 'Podpis zleceniodawcy', 'Podpis zleceniobiorcy']],
        body: tableData,
        startY: 30,
        theme: 'grid',
    });

    const pdfOutput = doc.output('blob');
    setPdfBlob(pdfOutput);
  };

  const signPDF = async () => {
    if (!pdfBlob) return;

    const signatureImage = signatureRef.current?.getTrimmedCanvas().toDataURL('image/png');
    if (!signatureImage) return;

    setSignatureImage(signatureImage);

    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const pngImageBytes = await fetch(signatureImage).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const { width, height } = firstPage.getSize();
    const signatureWidth = 50;
    const signatureHeight = 20;

    const daysInMonth = selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() : 0;

    const signaturePositions = Array.from({ length: daysInMonth }, (_, index) => ({
      x: 260,
      y: height - (128 + index * 21.5),
    }));

    signaturePositions.forEach((position) => {
      firstPage.drawImage(pngImage, {
        x: position.x,
        y: position.y,
        width: signatureWidth,
        height: signatureHeight,
      });
    });

    const signedPdfBytes = await pdfDoc.save();
    const signedPdfBlob = new Blob([signedPdfBytes], { type: 'application/pdf' });
    setPdfBlob(signedPdfBlob);
    setOpenSignatureDialog(false);
  };

  const downloadSignedPDF = () => {
    if (!pdfBlob) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'signed_employee_details.pdf';
    link.click();
  };

  const handleSignatureClear = () => {
    signatureRef.current?.clear();
  };

  

  return (
    <div className={styles.container}>
      {!isAssignProjectRoute && !isRemoveEmployeeRoute ? (
        <>
          <div className={styles.header}>
            <h1>Szczegóły pracownika - {employeeName}</h1>
            <IconButton onClick={toggleDrawer(true)} className={styles.calendarButton}>
              <img src={CalendarIcon} alt="Kalendarz" />
            </IconButton>
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.details}>
              <p><strong>Imię:</strong> {employeeName.split(' ')[0]}</p>
              <p><strong>Nazwisko:</strong> {employeeName.split(' ')[1]}</p>
              <p><strong>Umowa:</strong> {employee.contract}</p>
              <p><strong>Liczba przepracowanych godzin:</strong> {employee.hoursWorked}</p>
              <p><strong>Przepracowane godziny w wybranym dniu ({selectedDate ? format(selectedDate, 'dd.MM.yyyy') : 'Nie wybrano daty'}):</strong> {hoursWorkedOnDate}</p>
              <p><strong>Liczba przepracowanych godzin w całym miesiącu {selectedDate ? format(selectedDate, 'MM/yyyy') : 'nie wybrano daty'}:</strong> {hoursWorkedInMonth}</p>
            </div>
            <div className={styles.imageContainer}>
              <h2>Zdjęcie pracownika</h2>
              <img src={ExaxmpleProfilePicture} alt={`Zdjęcie ${employeeName}`} className={styles.employeeImage} />
              <button onClick={handleModify} className={styles.modifyButton}>
                Modyfikuj pracownika
              </button>
              <button className={styles.deleteButton} onClick={handleRemoveEmployee}>
                Usuń pracownika z projektu
              </button>
            </div>
            <div className={styles.projectsContainer}>
            <h2>Projekty</h2>
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.project_id} className={styles.projectRow}>
                  <span className={styles.projectName}>{project.name}</span>
                  {/* <button onClick={() => handleDisplayProject(project.project_id)} className={styles.showButton}>
                    Wyświetl
                  </button> */}
                </div>
              ))
            ) : (
              <p>Brak przypisanych projektów.</p>
            )}
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
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={generatePDF}>
                Generuj PDF
              </Button>
              <Button variant="contained" color="secondary" onClick={() => setOpenSignatureDialog(true)}>
                Podpis zleceniodawcy
              </Button>
              <Button variant="contained" color="secondary" onClick={downloadSignedPDF}>
                Otwórz PDF
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <Dialog open={openSignatureDialog} onClose={() => setOpenSignatureDialog(false)}>
        <DialogTitle>Wykonaj podpis</DialogTitle>
        <DialogContent>
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignatureClear}>Wyczyść</Button>
          <Button onClick={signPDF} color="primary">Zapisz</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
