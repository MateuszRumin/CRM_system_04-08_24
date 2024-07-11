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
    // Logika  wysyłania danych do serwera dla zaktualizowanego klienta


    // Usuwanie notatek
      if (deletedNotes.length > 0) {
        try {
            // Iteracja przez wszystkie ID notatek do usunięcia
            for (const noteId of deletedNotes) {
                const url = `http://localhost:3000/client/${clientId}/notes/${noteId}`;

                // Wysłanie zapytania DELETE dla każdej notatki
                await axios.delete(url);
            }

            console.log('Notatki zostały usunięte:', deletedNotes);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania notatek:', error);
        }
      } else {
        console.log('Nie ma notatek do usunięcia.');
      }

      console.log(deletedNotes);

      console.log(updatedClientData.firstName);

    // Usuwanie tasków
      if (deletedTasks.length > 0) {
        try {
            // Iteracja przez wszystkie ID tasków do usunięcia
            for (const taskId of deletedTasks) {
                const url = `http://localhost:3000/client/${clientId}/tasks/${taskId}`;

                // Wysłanie zapytania DELETE dla każdego taska
                await axios.delete(url);
            }

            console.log('Zadania zostały usunięte:', deletedTasks);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania zadań:', error);
        }
      } else {
        console.log('Nie ma zadań do usunięcia.');
      }

      console.log(deletedTasks);

      console.log(updatedClientData.firstName);


      // update danych klienta

      try {
        // Logika aktualizacji danych klienta
        console.log("to jest typ:", updatedClientData.companyType);
        const updatedClientUrl = `http://localhost:3000/client/${clientId}/update`;
        const response = await axios.put(updatedClientUrl, {
            client: {
                status_id: 1,
                user_id: 1,
                client_type: updatedClientData.companyType,
                first_name: updatedClientData.firstName,
                second_name: updatedClientData.lastName,
                regon: updatedClientData.regon,
                nip: updatedClientData.nip,
                krs: updatedClientData.krs,
                company_name: updatedClientData.companyName,
                address: updatedClientData.companyAddress,
            }
        });

        console.log('Odpowiedź z serwera:', response.data); // Loguj odpowiedź z serwera

        console.log('Dane klienta zostały zaktualizowane. Oto dane wysłane do aktualizacji:', updatedClientData);

    } catch (error) {
        console.error('Wystąpił błąd podczas wysyłania danych do serwera:', error);
    }



    try {
      // Aktualizacja tasków
      if (updatedTasks.length > 0) {
          for (const task of updatedTasks) {
              const { task_id, task_title, task_description, task_deadline, task_status } = task;
              const url = `http://localhost:3000/client/${clientId}/tasks/${task_id}`;

              // Sformatowanie daty do ISO-8601
              const isoDeadline = new Date(task_deadline).toISOString();

              // Konwersja task_status na int
              const statusId = parseInt(task_status);

              // Wysyłanie zaktualizowanych danych taska do serwera
              const response = await axios.put(url, {
                  task_id: updatedTasks,
                  status_id: statusId,
                  user_id: 1,  // Przykładowy user_id do przypisania do taska
                  task_name: task_title,
                  task_text: task_description,
                  deadline: isoDeadline  // Użycie sformatowanej daty ISO-8601
              });

              console.log(`Zaktualizowano zadanie o ID ${task_id}. Odpowiedź z serwera:`, response.data);
          }

          console.log('Zadania zostały zaktualizowane:', updatedTasks);
      } else {
          console.log('Nie ma zadań do zaktualizowania.');
      }


  } catch (error) {
      console.error('Wystąpił błąd podczas aktualizacji zadań:', error);
  }


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
      clientId,
      setClientId,
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
