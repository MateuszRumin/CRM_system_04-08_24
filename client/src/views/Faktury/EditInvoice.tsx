import styles from './EditInvoice.module.css';
import InvoiceDataForm from '../../components/Invoice/InvoiceDataForm';
import BlueButton from '../../components/Buttons/BlueButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

export function EditInvoice() {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [invoiceStatuses, setInvoiceStatuses] = useState<any[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
  const [invoiceTypes, setInvoiceTypes ] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoice_id) {
        console.error('Brak ID faktury');
        return;
      }

      try {
        const invoiceResponse = await axios.get(`${apiServerUrl}/invoices/${invoice_id}`);
        setInvoice(invoiceResponse.data);

        const invoiceTypeResponse = await axios.get(`${apiServerUrl}/invoices/settings`);
        setInvoiceTypes(invoiceTypeResponse.data.data.invoiceTypes);

        const invoiceStatusesResponse = await axios.get(`${apiServerUrl}/statuses/invoice`);
        setInvoiceStatuses(invoiceStatusesResponse.data);

        const paymentStatusesResponse = await axios.get(`${apiServerUrl}/statuses/payment`);
        setPaymentStatuses(paymentStatusesResponse.data);
        
        console.log(invoiceResponse, invoiceTypeResponse, invoiceStatusesResponse, paymentStatusesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchInvoiceData();
  }, [invoice_id]);

  const handleSubmit = async (data: any) => {
    if (!invoice_id) {
      console.error('Brak ID faktury');
      return;
    }

    const payment_id = invoice?.InvoicePayment?.[0]?.payment_id || null;

    console.log(payment_id);
    if (!payment_id) {
      console.error('Brak payment_id');
      // return;
    }
  
    try {
      const isoIssueDate = new Date(data.issue_date).toISOString();
      const isoDueDate = new Date(data.due_date).toISOString();
  
      const requestData = {
        main: {
          invoice_id: parseInt(invoice_id),
          issue_date: isoIssueDate,
          due_date: isoDueDate,
          status_id: data.status_id ? parseInt(data.status_id, 10) : null,
          invoice_type_id: data.invoice_type_id ? parseInt(data.invoice_type_id, 10) : null,
        },
        summary: {
          prize_netto: parseFloat(data.prize_netto),
          prize_brutto: parseFloat(data.prize_brutto),
          tax_ammount: parseFloat(data.tax_ammount),
          comments: data.comments || '',
        },
        payment: {
          payment_id: payment_id, 
          status_id: data.payment_status_id ? parseInt(data.payment_status_id, 10) : null,
        }
      };
      
      await axios.put(`${apiServerUrl}/invoices/updateInvoice`, requestData);
      console.log(requestData);
      alert('Faktura została zaktualizowana');
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };  

  const handleButtonClick = () => {
    const form = document.getElementById('invoiceDataFormId') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1>Edytuj fakturę</h1>
        <BlueButton
          buttonText="Zapisz fakturę"
          redirectPath="/faktury"
          onClickAction={handleButtonClick}
        />
      </div>
      <div className={styles.formContainer}>
        {invoice && (
          <InvoiceDataForm
            onSubmit={handleSubmit}
            formId="invoiceDataFormId"
            statuses={invoiceStatuses}
            paymentStatuses={paymentStatuses}
            initialValues={invoice}
            invoiceTypes={invoiceTypes}
          />
        )}
      </div>
    </div>
  );
}

export default EditInvoice;