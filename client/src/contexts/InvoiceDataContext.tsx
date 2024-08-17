import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

// Typy danych dla kontekstu faktur
interface InvoiceData {
  invoice_id?: number;
  invoice_number?: string;
  status_id?: number;
  invoice_type_id?: number;
  issue_date?: string;
  due_date?: string;
  prize_netto?: number;
  prize_brutto?: number;
  tax_ammount?: number;
  comments?: string;
  block?: boolean;
}

interface InvoicePayment {
  payment_id: number;
  invoice_id: number;
  status_id: number;
  status_name: string;
}

interface InvoiceDataContextProps {
  invoiceData: InvoiceData;
  setInvoiceData: Dispatch<SetStateAction<InvoiceData>>;
  isValid: boolean;
  setValid: Dispatch<SetStateAction<boolean>>;
  payments: InvoicePayment[];
  addPayment: (payment: InvoicePayment) => void;
  setPayments: Dispatch<SetStateAction<InvoicePayment[]>>;
  isValidPayments: boolean;
  setValidPayments: Dispatch<SetStateAction<boolean>>;
  setAddedPayments: (payments: InvoicePayment[]) => void;
  isEditingPayment: boolean;
  setIsEditingPayment: Dispatch<SetStateAction<boolean>>;
  isAddingPayment: boolean;
  setIsAddingPayment: Dispatch<SetStateAction<boolean>>;
}

// Domyślne wartości kontekstu
const defaultContextValue: InvoiceDataContextProps = {
  invoiceData: {},
  setInvoiceData: () => {},
  isValid: false,
  setValid: () => {},
  payments: [],
  addPayment: () => {},
  setPayments: () => {},
  isValidPayments: false,
  setValidPayments: () => {},
  setAddedPayments: () => {},
  isEditingPayment: false,
  setIsEditingPayment: () => {},
  isAddingPayment: false,
  setIsAddingPayment: () => {},
};

// Tworzenie kontekstu
const InvoiceDataContext = createContext<InvoiceDataContextProps>(defaultContextValue);

interface InvoiceDataProviderProps {
  children: ReactNode;
}

// Provider kontekstu
export const InvoiceDataProvider: React.FC<InvoiceDataProviderProps> = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({});
  const [isValid, setValid] = useState<boolean>(false);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [isValidPayments, setValidPayments] = useState<boolean>(false);
  const [isEditingPayment, setIsEditingPayment] = useState<boolean>(false);
  const [isAddingPayment, setIsAddingPayment] = useState<boolean>(false);

  const addPayment = (payment: InvoicePayment) => {
    setPayments(prevPayments => [...prevPayments, payment]);
    setIsAddingPayment(false); // Update state to indicate that adding is complete
  };

  const setAddedPayments = (payments: InvoicePayment[]) => {
    setPayments(payments);
  };

  useEffect(() => {
    setValidPayments(!isEditingPayment && !isAddingPayment);
  }, [isEditingPayment, isAddingPayment]);

  return (
    <InvoiceDataContext.Provider
      value={{
        invoiceData,
        setInvoiceData,
        isValid,
        setValid,
        payments,
        addPayment,
        setPayments,
        isValidPayments,
        setValidPayments,
        setAddedPayments,
        isEditingPayment,
        setIsEditingPayment,
        isAddingPayment,
        setIsAddingPayment,
      }}
    >
      {children}
    </InvoiceDataContext.Provider>
  );
};

// Hook do używania kontekstu
export const useInvoiceData = () => useContext(InvoiceDataContext);