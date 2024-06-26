import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataState {
  clientData: any; 
  notes: { content: string; timestamp: string }[]; 
  tasks: any[]; 
  setClientData: React.Dispatch<React.SetStateAction<any>>;
  setNotes: React.Dispatch<React.SetStateAction<{ content: string; timestamp: string }[]>>;
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  sendDataToServer: () => void; 
}

interface DataProviderProps {
  children: ReactNode;
}

// Utwórz kontekst danych
const DataContext = createContext<DataState | undefined>(undefined);

// Dostawca kontekstu, który będzie zarządzać stanem danych
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

  const [notes, setNotes] = useState<{ content: string; timestamp: string }[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Funkcja do wysłania danych na serwer
  const sendDataToServer = () => {
    console.log('Wysyłanie danych do serwera:', { clientData, notes, tasks });
    // Tutaj można umieścić logikę faktycznego wysyłania danych do serwera
    // Można użyć fetch lub axios do wysłania danych do API backendowego
  };

  return (
    <DataContext.Provider value={{ clientData, notes, tasks, setClientData, setNotes, setTasks, sendDataToServer }}>
      {children}
    </DataContext.Provider>
  );
};

// Funkcja do użycia kontekstu
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
