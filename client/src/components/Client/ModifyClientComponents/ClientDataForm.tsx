import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ClientDataForm.module.css';
import { useData } from '../../../contexts/DataContext';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface ClientDataFormProps {
  clientData: any;
  onSubmit: (data: any) => void;
  formId: string;
}

export function ClientDataForm({ clientData, onSubmit, formId }: ClientDataFormProps) {
  const { setValid } = useData();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid: formIsValid },
    trigger,
  } = useForm({
    mode: 'onChange',
  });

  const [showPrivateAddress, setShowPrivateAddress] = useState(false);
  const [isCompanyType, setIsCompanyType] = useState(true); // Assume default is 'Firma'

  useEffect(() => {
    Object.keys(clientData).forEach((key) => {
      setValue(key, clientData[key]);
    });

    const initialCompanyType = clientData.companyType;
    if (initialCompanyType) {
      setShowPrivateAddress(initialCompanyType === 'Prywatny');
      setIsCompanyType(initialCompanyType === 'Firma');
    }
  }, [clientData, setValue]);

  useEffect(() => {
    setValid(formIsValid);
  }, [formIsValid, setValid]);

  const fetchDataFromAPI = async (nip: string) => {
    try {
      const response = await fetch(`${apiServerUrl}/client/fetch-regon-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nip }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const handleFetchData = async () => {
    const nip = watch('nip');
    if (!nip) {
      console.error('NIP is required');
      return;
    }

    const data = await fetchDataFromAPI(nip);

    if (data) {
      setValue('regon', data.regon);
      setValue('krs', data.krs);
      setValue('companyName', data.name);
      setValue('companyAddress', data.address);
    }
  };

  const handleAddEmail = () => {
    const emails = watch('emails') || [];
    setValue('emails', [...emails, '']);
    trigger('emails');
  };

  const handleRemoveEmail = (index: number) => {
    const emails = watch('emails') || [];
    emails.splice(index, 1);
    setValue('emails', emails);
    trigger('emails');
  };

  const handleAddPhone = () => {
    const phones = watch('phones') || [];
    setValue('phones', [...phones, '']);
    trigger('phones');
  };

  const handleRemovePhone = (index: number) => {
    const phones = watch('phones') || [];
    phones.splice(index, 1);
    setValue('phones', phones);
    trigger('phones');
  };

  const handleCompanyTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedType = event.target.value;
    setShowPrivateAddress(selectedType === 'Prywatny');
    setIsCompanyType(selectedType === 'Firma'); // Update state based on company type
    setValue('companyType', selectedType);
  
    // If "Osoba prywatna" is selected, clear company-related fields
    if (selectedType === 'Prywatny') {
      setValue('nip', 'brak');
      setValue('regon', 'brak');
      setValue('krs', 'brak');
      setValue('companyName', 'brak');
      setValue('companyAddress', 'brak');
    }
  };

  // Register the field without any validation rules
  useEffect(() => {
    register('krs', { required: false }); // Disable validation
  }, [register]);

  return (
    <div className={styles.formContainer}>
      <h2>Dane klienta</h2>
      <form id={formId} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Form content */}
        <div className={styles.row}>
          <label className={styles.label}>
            Status
            <select className={styles.select} {...register('status', { required: 'Status jest wymagany.' })}>
              <option value="1">Niepodjęty</option>
              <option value="2">W trakcie</option>
              <option value="3">Zdobyty</option>
              <option value="4">Stracony</option>
            </select>
            {errors.status && <span className={styles.error}>{errors.status.message as string}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Imię
            <input
              className={styles.input}
              type="text"
              {...register('firstName', {
                required: 'Imię jest wymagane.',
                minLength: { value: 2, message: 'Imię musi mieć co najmniej 2 znaki.' },
                pattern: {
                  value: /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
                  message: 'Imię może zawierać tylko litery i spacje.',
                },
              })}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName.message as string}</span>}
          </label>
          <label className={styles.label}>
            Nazwisko
            <input
              className={styles.input}
              type="text"
              {...register('lastName', {
                required: 'Nazwisko jest wymagane.',
                minLength: { value: 2, message: 'Nazwisko musi mieć co najmniej 2 znaki.' },
                pattern: {
                  value: /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
                  message: 'Nazwisko może zawierać tylko litery i spacje.',
                },
              })}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName.message as string}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.radioGroup}>
            <input
              type="radio"
              {...register('companyType')}
              value="Firma"
              onChange={handleCompanyTypeChange}
              checked={watch('companyType') === 'Firma'}
            />
            Firma
          </label>
          <label className={styles.radioGroup}>
            <input
              type="radio"
              {...register('companyType')}
              value="Prywatny"
              onChange={handleCompanyTypeChange}
              checked={watch('companyType') === 'Prywatny'}
            />
            Osoba prywatna
          </label>
        </div>
        {showPrivateAddress && (
          <div className={styles.row}>
            <label className={styles.label}>
              Adres osoby prywatnej
              <input
                className={styles.input}
                type="text"
                {...register('companyAddress', {
                  minLength: { value: 3, message: 'Adres osoby prywatnej musi mieć co najmniej 3 znaki.' },
                })}
              />
              {errors.privateAddress && <span className={styles.error}>{errors.privateAddress.message as string}</span>}
            </label>
          </div>
        )}
        {watch('companyType') === 'Firma' && (
          <>
            <div className={styles.row}>
              <label className={styles.label}>
                NIP
                <input
                  className={styles.input}
                  type="text"
                  {...register('nip', {
                    required: 'NIP jest wymagany.',
                    minLength: { value: 10, message: 'NIP musi mieć 10 znaków.' },
                    maxLength: { value: 10, message: 'NIP musi mieć 10 znaków.' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'NIP może zawierać tylko cyfry.',
                    },
                  })}
                />
                {errors.nip && <span className={styles.error}>{errors.nip.message as string}</span>}
              </label>
              <button className={styles.addPhoneButton} type="button" onClick={handleFetchData}>
                Pobierz dane z REGON
              </button>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>
                REGON
                <input
                  className={styles.input}
                  type="text"
                  {...register('regon', {
                    required: 'REGON jest wymagany.',
                    minLength: { value: 9, message: 'REGON musi mieć 9 znaków.' },
                    maxLength: { value: 9, message: 'REGON musi mieć 9 znaków.' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'REGON może zawierać tylko cyfry.',
                    },
                  })}
                />
                {errors.regon && <span className={styles.error}>{errors.regon.message as string}</span>}
              </label>
              <label className={styles.label}>
                KRS
                <input
                  className={styles.input}
                  type="text"
                  {...register('krs', { required: false })} // Disable validation
                />
                {errors.krs && <span className={styles.error}>{errors.krs.message as string}</span>}
              </label>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>
                Nazwa firmy
                <input
                  className={styles.input}
                  type="text"
                  {...register('companyName', { minLength: { value: 3, message: 'Nazwa firmy musi mieć co najmniej 3 znaki.' } })}
                />
                {errors.companyName && <span className={styles.error}>{errors.companyName.message as string}</span>}
              </label>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>
                Adres firmy
                <input
                  className={styles.input}
                  type="text"
                  {...register('companyAddress', { minLength: { value: 3, message: 'Adres firmy musi mieć co najmniej 3 znaki.' } })}
                />
                {errors.companyAddress && <span className={styles.error}>{errors.companyAddress.message as string}</span>}
              </label>
            </div>
          </>
        )}
        <div className={styles.emailPhoneContainer}>
          <div className={styles.emailSection}>
            <h3>Emaile:</h3>
            {watch('emails', []).map((email: string, index: number) => (
              <div key={index} className={styles.emailRow}>
                <input
                  className={styles.input}
                  type="email"
                  {...register(`emails.${index}`, {
                    required: 'Email jest wymagany.',
                    pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Nieprawidłowy format email.' },
                  })}
                />
                <button className={styles.addPhoneButton} type="button" onClick={() => handleRemoveEmail(index)}>
                  Usuń
                </button>
              </div>
            ))}
            <button className={styles.addEmailButton} type="button" onClick={handleAddEmail}>
              Dodaj email
            </button>
          </div>
          <div className={styles.phoneSection}>
            <h3>Numery telefonów:</h3>
            {watch('phones', []).map((phone: string, index: number) => (
              <div key={index} className={styles.phoneRow}>
                <input
                  className={styles.input}
                  type="tel"
                  {...register(`phones.${index}`, {
                    required: 'Numer telefonu jest wymagany.',
                    pattern: { value: /^[0-9]+$/, message: 'Numer telefonu może zawierać tylko cyfry.' },
                  })}
                />
                <button className={styles.addPhoneButton} type="button" onClick={() => handleRemovePhone(index)}>
                  Usuń
                </button>
              </div>
            ))}
            <button className={styles.addPhoneButton} type="button" onClick={handleAddPhone}>
              Dodaj telefon
            </button>
          </div>
        </div>
        <button type="submit" style={{ display: 'none' }}>Ukryty przycisk</button>
      </form>
    </div>
  );
}
