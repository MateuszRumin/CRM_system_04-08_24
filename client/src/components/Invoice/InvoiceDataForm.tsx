import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './InvoiceDataForm.module.css';

interface InvoiceDataFormProps {
  onSubmit: (data: any) => void;
  formId: string;
  statuses: any[];
  paymentStatuses: any[];
  invoiceTypes: any[];
  initialValues: any;
}

interface FormValues {
  issue_date: string;
  due_date: string;
  status_id: number;
  invoice_type_id: number;
  prize_netto: number;
  prize_brutto: number;
  tax_ammount: number;
  comments: string;
  payment_status_id: number;
}

export function InvoiceDataForm({ onSubmit, formId, statuses, initialValues, paymentStatuses, invoiceTypes }: InvoiceDataFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      issue_date: initialValues?.issue_date.split('T')[0] || '',
      due_date: initialValues?.due_date.split('T')[0] || '',
      status_id: initialValues?.status_id || 0,
      invoice_type_id: initialValues?.invoice_type_id || 0,
      prize_netto: initialValues?.prize_netto || 0,
      prize_brutto: initialValues?.prize_brutto || 0,
      tax_ammount: initialValues?.tax_ammount || 0,
      comments: initialValues?.comments || '',
      payment_status_id: initialValues?.InvoicePayment?.[0]?.status_id || 0,
    },
  });

  // Watch for changes in netto and VAT fields
  const watchNetto = watch('prize_netto');
  const watchVAT = watch('tax_ammount');
  const watchStatus = watch('status_id');

  useEffect(() => {
    // Calculate the brutto value when netto or VAT changes
    const netto = parseFloat(watchNetto) || 0;
    const vat = parseFloat(watchVAT) || 0;
    const brutto = netto + vat;
    setValue('prize_brutto', brutto.toFixed(2)); // Update the brutto value in the form
  }, [watchNetto, watchVAT, setValue]);

  useEffect(() => {
    setValue('issue_date', initialValues?.issue_date?.split('T')[0] || '');
    setValue('due_date', initialValues?.due_date?.split('T')[0] || '');
    setValue('status_id', initialValues?.status_id || 0);
    setValue('invoice_type_id', initialValues?.invoice_type_id || 0);
    setValue('prize_netto', initialValues?.prize_netto || 0);
    setValue('prize_brutto', initialValues?.prize_brutto || 0);
    setValue('tax_ammount', initialValues?.tax_ammount || 0);
    setValue('comments', initialValues?.comments || '');
    setValue('payment_status_id', initialValues.InvoicePayment?.[0]?.status_id || 0);
  }, [initialValues, setValue]);

  // Determine if the invoice is editable based on status
  const isEditable = watchStatus === 12; // Status ID for "Nie wystawiona"
  const isPaymentStatusEditable = watchStatus === 12 || watchStatus === 16 || watchStatus === 17;

  return (
    <div className={styles.formContainer}>
      <h2>Dane faktury</h2>
      <form id={formId} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label className={styles.label}>
            Data wystawienia
            <input
              className={styles.input}
              type="date"
              {...register('issue_date', { required: isEditable && 'Data wystawienia jest wymagana' })}
              disabled={!isEditable}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Termin płatności
            <input
              className={styles.input}
              type="date"
              {...register('due_date', { required: isEditable && 'Data płatności jest wymagana' })}
              disabled={!isEditable}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Status faktury
            <Controller
              name="status_id"
              control={control}
              render={({ field }) => (
                <select className={styles.select} {...field} disabled={!isEditable}>
                  <option value="">Wybierz status</option>
                  {statuses.map((status) => (
                    <option key={status.status_id} value={status.status_id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Status płatności
            <Controller
              name="payment_status_id"
              control={control}
              render={({ field }) => (
                <select className={styles.select} {...field} disabled={!isPaymentStatusEditable}>
                  <option value="">Wybierz status płatności</option>
                  {paymentStatuses.map((status) => (
                    <option key={status.status_id} value={status.status_id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Typ faktury
            <Controller
              name="invoice_type_id"
              control={control}
              render={({ field }) => (
                <select className={styles.select} {...field} disabled={!isEditable}>
                  <option value="">Wybierz typ faktury</option>
                  {invoiceTypes.map((invoiceType) => (
                    <option key={invoiceType.invoice_type_id} value={invoiceType.invoice_type_id}>
                      {invoiceType.invoice_type}
                    </option>
                  ))}
                </select>
              )}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Kwota netto
            <input
              className={styles.input}
              type="number"
              step="0.01"
              {...register('prize_netto', { required: isEditable && 'Kwota netto jest wymagana' })}
              disabled={!isEditable}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Kwota brutto
            <input
              className={styles.input}
              type="number"
              step="0.01"
              value={watchNetto ? (parseFloat(watchNetto) + parseFloat(watchVAT)).toFixed(2) : 0}
              readOnly
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Kwota VAT
            <input
              className={styles.input}
              type="number"
              step="0.01"
              {...register('tax_ammount', { required: isEditable && 'Kwota VAT jest wymagana' })}
              disabled={!isEditable}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Komentarze
            <textarea
              className={styles.textarea}
              {...register('comments')}
            />
          </label>
        </div>
        <button type="submit" style={{ display: 'none' }}></button> {/* Ukryty przycisk do wymuszenia submit */}
      </form>
    </div>
  );
}

export default InvoiceDataForm;