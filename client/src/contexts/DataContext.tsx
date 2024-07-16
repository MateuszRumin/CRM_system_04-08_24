import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import axios from 'axios';

interface Note {
  note_id: number;
  note_text: string;
}

interface Task {
  task_id: number;
  task_title: string;
  task_deadline: string;
  task_status: string;
  task_description: string;
}


interface Employee {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
}

interface DataState {
  clientData: any;
  addedClientData: any;
  updatedClientData: any;
  deletedClientData: any;
  notes: Note[];
  addedNotes: Note[];
  updatedNotes: Note[];
  deletedNotes: number[];
  tasks: Task[];
  addedTasks: Task[];
  updatedTasks: Task[];
  deletedTasks: number[];
  isValid: boolean;
  isValidNotes: boolean;
  isValidTasks: boolean;
  clientId: string;
  setClientId: Dispatch<SetStateAction<string>>;
  employeeData: any;
  setClientData: Dispatch<SetStateAction<any>>;
  setAddedClientData: Dispatch<SetStateAction<any>>;
  setUpdatedClientData: Dispatch<SetStateAction<any>>;
  setDeletedClientData: Dispatch<SetStateAction<any>>;
  setNotes: Dispatch<SetStateAction<Note[]>>;
  setAddedNotes: Dispatch<SetStateAction<Note[]>>;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: number) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setAddedTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  sendDataToServerAddedClient: () => void;
  sendDataToServerUpdatedClient: () => void;
  setValid: (isValid: boolean) => void;
  setValidNotes: (isValidNotes: boolean) => void;
  setValidTasks: (isValidTasks: boolean) => void;
  updateClient: (clientId: string, data: any) => void;
  getEmployeeData: (employeeId: string) => Promise<any>;
  updateEmployeeData: (employeeId: string, updatedData: any) => Promise<void>;
  setEmployeeData: Dispatch<SetStateAction<any>>;
  
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext<DataState | undefined>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [clientData, setClientData] = useState<any>({
    status: '',
    assignedEmployee: '',
    firstName: '',
    lastName: '',
    companyType: '',
    nip: '',
    regon: '',
    krs: '',
    companyName: '',
    companyAddress: '',
    emails: [''],
    phones: [''],
  });

  const [employeeData, setEmployeeData] = useState<Employee>({
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    startDate: '',
  });

  const [addedClientData, setAddedClientData] = useState<any>({});
  const [updatedClientData, setUpdatedClientData] = useState<any>({});
  const [deletedClientData, setDeletedClientData] = useState<any>({});

  const [notes, setNotes] = useState<Note[]>([]);
  const [addedNotes, setAddedNotes] = useState<Note[]>([]);
  const [updatedNotes, setUpdatedNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<number[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addedTasks, setAddedTasks] = useState<Task[]>([]);
  const [updatedTasks, setUpdatedTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<number[]>([]);

  const [isValid, setIsValid] = useState<boolean>(false);
  const [isValidNotes, setIsValidNotes] = useState<boolean>(false);
  const [isValidTasks, setIsValidTasks] = useState<boolean>(false);

  const [clientId, setClientId] = useState<string>('');

  const addNote = (note: Note) => {
    setNotes(prevNotes => [...prevNotes, note]);
    setAddedNotes(prevAddedNotes => [...prevAddedNotes, note]);
  };

  const updateNote = (note: Note) => {
    setNotes(prevNotes => prevNotes.map(n => (n.note_id === note.note_id ? note : n)));
    setUpdatedNotes(prevUpdatedNotes => {
      const updated = prevUpdatedNotes.filter(n => n.note_id !== note.note_id);
      return [...updated, note];
    });
  };

  const deleteNote = (noteId: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.note_id !== noteId));
    setDeletedNotes(prevDeletedNotes => [...prevDeletedNotes, noteId]);
  };

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
    setAddedTasks(prevAddedTasks => [...prevAddedTasks, task]);
  };

  const updateTask = (task: Task) => {
    setTasks(prevTasks => prevTasks.map(t => (t.task_id === task.task_id ? task : t)));
    setUpdatedTasks(prevUpdatedTasks => {
      const updated = prevUpdatedTasks.filter(t => t.task_id !== task.task_id);
      return [...updated, task];
    });
  };

  const deleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.task_id !== taskId));
    setDeletedTasks(prevDeletedTasks => [...prevDeletedTasks, taskId]);
  };

  useEffect(() => {
    if (Object.keys(updatedClientData).length > 0 && Object.keys(addedClientData).length === 0) {
      sendDataToServerUpdatedClient();
    } else if (Object.keys(addedClientData).length > 0) {
      sendDataToServerAddedClient();
    }
  }, [addedClientData, updatedClientData]);

  const sendDataToServerAddedClient = () => {
    console.log('Wysyłanie danych do serwera z nowym klientem:', { 
      clientData,
      addedClientData, // Dodajemy dane nowego klienta
      addedNotes,
      addedTasks,
    });
  
    // Tutaj dodaj logikę faktycznego wysyłania danych do serwera
  };

  const sendDataToServerUpdatedClient = async () => {
    console.log('Wysyłanie danych do serwera ze zmodyfikowanym klientem:', {
        updatedClientData,
        addedNotes,
        addedTasks,
        deletedNotes,
        deletedTasks,
        updatedNotes,
        updatedTasks,
        notes,
        tasks,
        clientId
    });
    // Logika wysyłania danych do serwera dla zaktualizowanego klienta

    // Dodawanie nowych notatek
    try {
        if (addedNotes.length > 0) {
            const dataToAdd = {
                user_id: 1,
                notes: addedNotes.map(note => ({
                    note_text: note.note_text
                }))
            };
            const response = await axios.post(`http://localhost:3000/client/${clientId}/notes`, dataToAdd);
            console.log('Dodano nowe notatki:', response.data);
        } else {
            console.log('Nie ma notatek do dodania.');
        }
    } catch (error) {
        console.error('Błąd podczas dodawania notatek:', error);
    }

    // Usuwanie notatek
    if (deletedNotes.length > 0) {
        try {
            for (const noteId of deletedNotes) {
                const url = `http://localhost:3000/client/notes/${noteId}`;
                await axios.delete(url);
            }
            console.log('Notatki zostały usunięte:', deletedNotes);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania notatek:', error);
        }
    } else {
        console.log('Nie ma notatek do usunięcia.');
    }

    // Usuwanie tasków
    if (deletedTasks.length > 0) {
        try {
            for (const taskId of deletedTasks) {
                const url = `http://localhost:3000/client/tasks/${taskId}`;
                await axios.delete(url);
            }
            console.log('Zadania zostały usunięte:', deletedTasks);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania zadań:', error);
        }
    } else {
        console.log('Nie ma zadań do usunięcia.');
    }

    // Aktualizacja danych klienta
    try {
        const updatedClientUrl = `http://localhost:3000/client/${clientId}/update`;
        const response = await axios.put(updatedClientUrl, {
            client_id: clientId,
            status_id: parseInt(updatedClientData.status),
            user_id: 1,
            client_type: updatedClientData.companyType,
            registration_date: updatedClientData.registrationDate || new Date().toISOString(), // Dodaj datę rejestracji
            first_name: updatedClientData.firstName,
            second_name: updatedClientData.lastName,
            regon: updatedClientData.regon,
            nip: updatedClientData.nip,
            krs: updatedClientData.krs,
            company_name: updatedClientData.companyName,
            address: updatedClientData.companyAddress,
            ClientEmail: updatedClientData.emails || [], // Dodaj e-maile
            ClientPhone: updatedClientData.phones || []  // Dodaj numery telefonów
        });

        console.log('Odpowiedź z serwera:', response.data);
        console.log('Dane klienta zostały zaktualizowane. Oto dane wysłane do aktualizacji:', updatedClientData);
    } catch (error) {
        console.error('Wystąpił błąd podczas wysyłania danych do serwera:', error);
    }

    // Aktualizacja tasków
    try {
        if (updatedTasks.length > 0) {
            for (const task of updatedTasks) {
                const { task_id, task_title, task_description, task_deadline, task_status } = task;
                const url = `http://localhost:3000/client/tasks/${task_id}`;
                const isoDeadline = new Date(task_deadline).toISOString();
                const statusId = parseInt(task_status);

                const response = await axios.put(url, {
                    task_id: updatedTasks,
                    status_id: statusId,
                    user_id: 1,
                    task_name: task_title,
                    task_text: task_description,
                    deadline: isoDeadline
                });

                console.log(`Zaktualizowano zadanie o ID ${task_id}. Odpowiedź z serwera:`, response.data);
            }
            console.log('Zadania zostały zaktualizowane:', updatedTasks);
        } else {
            console.log('Nie ma zadań do zaktualizowania.');
        }

        // Aktualizacja notatek
        if (updatedNotes.length > 0) {
            for (const note of updatedNotes) {
                const { note_id, note_text } = note;
                const url = `http://localhost:3000/client/notes/${note_id}`;
                const response = await axios.put(url, {
                    note_text: note_text
                });

                console.log(`Zaktualizowano notatkę o ID ${note_id}. Odpowiedź z serwera:`, response.data);
            }
            console.log('Notatki zostały zaktualizowane:', updatedNotes);
        } else {
            console.log('Nie ma notatek do zaktualizowania.');
        }
    } catch (error) {
        console.error('Wystąpił błąd podczas aktualizacji zadań:', error);
    }

    // Dodawanie nowych tasków
    try {
        if (addedTasks.length > 0) {
            const dataToAdd = {
                user_id: 1,
                client_id: clientId,
                tasks: addedTasks.map(task => ({
                    task_name: task.task_title,
                    task_text: task.task_description,
                    status_id: task.task_status,
                    deadline: new Date(task.task_deadline).toISOString()
                }))
            };
            const response = await axios.post(`http://localhost:3000/client/${clientId}/tasks`, dataToAdd);
            console.log('Dodano nowe zadania:', response.data);
        } else {
            console.log('Nie ma zadań do dodania.');
        }
    } catch (error) {
        console.error('Błąd podczas dodawania zadań:', error);
    }

    // Dodawanie kontaktów
    try {
        const dataToAdd = {
            client_id: clientId,
            emails: updatedClientData.emails,
            phones: updatedClientData.phones
        };
        const response = await axios.post(`http://localhost:3000/client/${clientId}/contact`, dataToAdd);
        console.log('Dodano nowe kontakty:', response.data);
    } catch (error) {
        console.error('Błąd podczas dodawania kontaktów:', error);
    }

    // Po wysłaniu danych, wykonujemy czyszczenie
    setUpdatedClientData({});
    setAddedNotes([]);
    setAddedTasks([]);
    setDeletedNotes([]);
    setDeletedTasks([]);
    setUpdatedNotes([]);
    setUpdatedTasks([]);
    setNotes([]);
    setTasks([]);
};




  const setValid = (isValid: boolean) => {
    setIsValid(isValid);
  };

  const setValidNotes = (isValidNotes: boolean) => {
    setIsValidNotes(isValidNotes);
  };

  const setValidTasks = (isValidTasks: boolean) => {
    setIsValidTasks(isValidTasks);
  };

  const updateClient = (clientId: string, data: any) => {
    setUpdatedClientData(data);
  };


  const getEmployeeData = async (employeeId: string) => {
    // Fetch employee data from the server or database
    const response = await fetch(`/api/employees/${employeeId}`);
    const data = await response.json();
    return data;
  };
  
  const updateEmployeeData = async (employeeId: string, updatedData: any) => {
    // Update employee data on the server or database
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
  };


  

  return (
    <DataContext.Provider value={{ 
      clientData, 
      addedClientData,
      updatedClientData,
      deletedClientData,
      notes, 
      addedNotes, 
      updatedNotes, 
      deletedNotes, 
      tasks, 
      addedTasks, 
      updatedTasks, 
      deletedTasks, 
      isValid,
      isValidNotes, 
      isValidTasks,
      clientId,
      setClientId,
      employeeData,
      setClientData, 
      setAddedClientData,
      setUpdatedClientData,
      setDeletedClientData,
      setNotes, 
      setAddedNotes,
      addNote, 
      updateNote, 
      deleteNote, 
      setTasks,
      setAddedTasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      sendDataToServerAddedClient,
      sendDataToServerUpdatedClient,
      setValid,
      setValidNotes,
      setValidTasks,
      updateClient,
      setEmployeeData,
      getEmployeeData,
      updateEmployeeData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
