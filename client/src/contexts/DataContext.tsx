import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

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

  const sendDataToServerUpdatedClient = () => {
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
    });
    // Logika faktycznego wysyłania danych do serwera dla zaktualizowanego klienta

    console.log(updatedClientData.firstName)
    // Logika faktycznego wysyłania danych do serwera dla zaktualizowanego klienta
    //// tutaj będzie wykorzystanie endpointu do dodania do bazy danych 

    // Po wysłaniu danych, wykonujemy czyszczenie
    setUpdatedClientData({}); // Czyszczenie zaktualizowanych danych klienta
    setAddedNotes([]); // Czyszczenie dodanych notatek
    setAddedTasks([]); // Czyszczenie dodanych zadań
    setDeletedNotes([]); // Czyszczenie usuniętych notatek
    setDeletedTasks([]); // Czyszczenie usuniętych zadań
    setUpdatedNotes([]); // Czyszczenie zaktualizowanych notatek
    setUpdatedTasks([]); // Czyszczenie zaktualizowanych zadań
    setNotes([]); // Czyszczenie notatek
    setTasks([]); // Czyszczenie zadań


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
      updateClient
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
