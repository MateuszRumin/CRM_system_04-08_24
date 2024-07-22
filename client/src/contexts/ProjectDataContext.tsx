import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Typy danych dla kontekstu
interface Note {
  note_id: number;
  note_text: string;
  timestamp?: string;
}

interface ProjectData {
  name?: string;
  endDate?: string;
  client?: string;
  employees?: string[];
}

interface ProjectDataContextProps {
  projectData: ProjectData;
  setProjectData: Dispatch<SetStateAction<ProjectData>>;
  isValid: boolean;
  setValid: Dispatch<SetStateAction<boolean>>;
  notes: Note[];
  addNote: (note: Note) => void;
  setNotes: Dispatch<SetStateAction<Note[]>>;
  isValidNotes: boolean;
  setValidNotes: Dispatch<SetStateAction<boolean>>;
  setAddedNotes: (notes: Note[]) => void;
}

// Domyślne wartości kontekstu
const defaultContextValue: ProjectDataContextProps = {
  projectData: {},
  setProjectData: () => {},
  isValid: false,
  setValid: () => {},
  notes: [],
  addNote: () => {},
  setNotes: () => {},
  isValidNotes: false,
  setValidNotes: () => {},
  setAddedNotes: () => {},
};

// Tworzenie kontekstu
const ProjectDataContext = createContext<ProjectDataContextProps>(defaultContextValue);

interface ProjectDataProviderProps {
  children: ReactNode;
}

// Provider kontekstu
export const ProjectDataProvider: React.FC<ProjectDataProviderProps> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>({});
  const [isValid, setValid] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isValidNotes, setValidNotes] = useState<boolean>(false);

  const addNote = (note: Note) => {
    setNotes(prevNotes => [...prevNotes, note]);
  };

  const setAddedNotes = (notes: Note[]) => {
    setNotes(notes);
  };

  return (
    <ProjectDataContext.Provider
      value={{
        projectData,
        setProjectData,
        isValid,
        setValid,
        notes,
        addNote,
        setNotes,
        isValidNotes,
        setValidNotes,
        setAddedNotes,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
};

// Hook do używania kontekstu
export const useProjectData = () => useContext(ProjectDataContext);
