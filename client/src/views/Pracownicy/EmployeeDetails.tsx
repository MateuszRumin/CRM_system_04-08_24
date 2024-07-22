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

interface Project {
  project_id: string;
  name: string;
  client_id: string;
  status_id: string;
  created_at: string;
}

export function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  const signatureRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/with/${employee?.id}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (employee) {
      fetchProjects();
    }
  }, [employee]);

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
    // Możesz dodać kod do nawigacji do szczegółów projektu
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

  type TableCellData = string | { content: string, type: 'image' };

  const generatePDF = () => {
    if (!selectedDate) {
      console.log("Brak wybranej daty, nie generujemy PDF-a");
      return;
    }

    const selectedDateString = format(selectedDate, 'dd.MM.yyyy');
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    const tableData = Array.from({ length: daysInMonth }, (_, i) => [
      `${i + 1}`,
      `${5 + i % 8} H`,
      signatureImage ? { content: signatureImage, type: 'image' } : '',
      ''
    ]);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'unicode');

    doc.setDrawColor(233, 233, 233);
    doc.setFillColor(233, 233, 233);
    doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');

    doc.text('Wykaz godzin', 15, 12);

    autoTable(doc, {
      head: [['Dzien', 'Ilosc godzin', 'Podpis zleceniodawcy', 'Podpis zleceniobiorcy']],
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
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.project_id} className={styles.projectRow}>
                    <span className={styles.projectName}>{project.name}</span>
                    <button onClick={() => handleDisplayProject(project.project_id)} className={styles.showButton}>
                      Wyświetl
                    </button>
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
