import React, { useState, useEffect } from 'react';
import styles from './ClientDataForm.module.css';
import { useData } from '../../../contexts/DataContext';

export function ClientDataForm() {
  const { clientData, setClientData } = useData();
  const [localClientData, setLocalClientData] = useState(clientData);

  useEffect(() => {
    setLocalClientData(clientData);
  }, [clientData]);

  useEffect(() => {
    setClientData(localClientData);
  }, [localClientData, setClientData]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalClientData({ ...localClientData, status: e.target.value });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalClientData({ ...localClientData, assignedEmployee: e.target.value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalClientData({ ...localClientData, [name]: value });
  };

  const handleCompanyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalClientData({ ...localClientData, [name]: value });
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...localClientData.emails];
    updatedEmails[index] = value;
    setLocalClientData({ ...localClientData, emails: updatedEmails });
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...localClientData.phones];
    updatedPhones[index] = value;
    setLocalClientData({ ...localClientData, phones: updatedPhones });
  };

  const handleAddEmail = () => {
    setLocalClientData({ ...localClientData, emails: [...localClientData.emails, ''] });
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = [...localClientData.emails];
    updatedEmails.splice(index, 1);
    setLocalClientData({ ...localClientData, emails: updatedEmails });
  };

  const handleAddPhone = () => {
    setLocalClientData({ ...localClientData, phones: [...localClientData.phones, ''] });
  };

  const handleRemovePhone = (index: number) => {
    const updatedPhones = [...localClientData.phones];
    updatedPhones.splice(index, 1);
    setLocalClientData({ ...localClientData, phones: updatedPhones });
  };

  const handleFetchData = () => {
    // Tutaj można by zaimplementować logikę pobierania danych z REGON
    console.log('Symulacja pobrania danych z REGON:', localClientData.nip);
    // Na potrzeby symulacji, logujemy NIP klienta
  };

  return (
    <div className={styles.formContainer}>
      <h2>Dane klienta</h2>
      <form className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>
            Status
            <select
              className={styles.select}
              name="status"
              value={clientData.status}
              onChange={handleStatusChange}
            >
              <option value="wtrakcie">W trakcie</option>
              <option value="zrobiony">Zrobiony</option>
              <option value="niezrobiony">Niezrobiony</option>
            </select>
          </label>
          <label className={styles.label}>
            Przypisany pracownik
            <select
              className={styles.select}
              name="assignedEmployee"
              value={clientData.assignedEmployee}
              onChange={handleEmployeeChange}
            >
              <option value="">Wybierz pracownika</option>
              <option value="Kamil Wojnarowski">Kamil Wojnarowski</option>
              <option value="other">Inny pracownik</option>
            </select>
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Imię
            <input
              className={styles.input}
              type="text"
              name="firstName"
              value={clientData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label className={styles.label}>
            Nazwisko
            <input
              className={styles.input}
              type="text"
              name="lastName"
              value={clientData.lastName}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.radioGroup}>
            <input
              type="radio"
              name="companyType"
              value="firma"
              checked={clientData.companyType === 'firma'}
              onChange={handleCompanyTypeChange}
            />
            Firma
          </label>
          <label className={styles.radioGroup}>
            <input
              type="radio"
              name="companyType"
              value="osobaPrywatna"
              checked={clientData.companyType === 'osobaPrywatna'}
              onChange={handleCompanyTypeChange}
            />
            Osoba prywatna
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            NIP
            <input
              className={styles.input}
              type="text"
              name="nip"
              value={clientData.nip}
              onChange={handleInputChange}
            />
          </label>
          <button
            className={styles.button}
            type="button"
            onClick={handleFetchData}
          >
            Pobierz dane z REGON
          </button>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            REGON
            <input
              className={styles.input}
              type="text"
              name="regon"
              value={clientData.regon}
              onChange={handleInputChange}
            />
          </label>
          <label className={styles.label}>
            KRS
            <input
              className={styles.input}
              type="text"
              name="krs"
              value={clientData.krs}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Nazwa firmy
            <input
              className={styles.input}
              type="text"
              name="companyName"
              value={clientData.companyName}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Adres firmy
            <input
              className={styles.input}
              type="text"
              name="companyAddress"
              value={clientData.companyAddress}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className={styles.phoneEmailSection}>
          <div className={styles.section}>
            <h3>Email</h3>
            {clientData.emails.map((email: string, index: number) => (
              <div className={styles.row} key={index}>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => handleRemoveEmail(index)}
                >
                  Usuń
                </button>
              </div>
            ))}
            <button
              className={styles.addEmailButton}
              type="button"
              onClick={handleAddEmail}
            >
              Dodaj email
            </button>
          </div>
          <div className={styles.section}>
            <h3>Telefony</h3>
            {clientData.phones.map((phone: string, index: number) => (
              <div className={styles.row} key={index}>
                <input
                  className={styles.input}
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                />
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => handleRemovePhone(index)}
                >
                  Usuń
                </button>
              </div>
            ))}
            <button
              className={styles.addPhoneButton}
              type="button"
              onClick={handleAddPhone}
            >
              Dodaj telefon
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
