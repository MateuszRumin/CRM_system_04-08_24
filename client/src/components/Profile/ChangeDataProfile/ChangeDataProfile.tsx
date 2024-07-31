import React, { useState } from 'react';
import styles from './ChangeDataProfile.module.css';

interface RolesProps {
  onClose: () => void;
}

export const ChangeDataProfile: React.FC<RolesProps> = ({ onClose }) => {
  const [user, setUser] = useState({
    name: 'Jan',
    surname: 'Kowalski',
    email: 'jan@gmail.com',
    umowa: 'umowa.pdf',
    adres: 'Warszawa 397A 34-567',
    number: '123123123',
    hired: '2024-07-05', // format YYYY-MM-DD
  });

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    umowa: '',
    adres: '',
    number: '',
    hired: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [id]: value,
    }));

    // Reset error for the field that is being changed
    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const handleSave = () => {
    let valid = true;
    const newErrors = {
      name: '',
      surname: '',
      email: '',
      umowa: '',
      adres: '',
      number: '',
      hired: '',
    };

    Object.keys(user).forEach(key => {
      if (!user[key as keyof typeof user]) {
        valid = false;
        newErrors[key as keyof typeof newErrors] = 'Pole nie może być puste';
      }
    });

    setErrors(newErrors);

    if (valid) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Zmiana danych</h2>
        <div className={styles.content}>
          <section className={styles.contentSection}>
            <label htmlFor="name">Imie</label>
            <input type="text" id="name" value={user.name} onChange={handleChange} />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </section>
          <section className={styles.contentSection}>
            <label htmlFor="surname">Nazwisko</label>
            <input type="text" id="surname" value={user.surname} onChange={handleChange} />
            {errors.surname && <span className={styles.error}>{errors.surname}</span>}
          </section>
        </div>
        <div className={styles.content}>
          <section className={styles.contentSection}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={user.email} onChange={handleChange} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </section>
          <section className={styles.contentSection}>
            <label htmlFor="umowa">Umowa</label>
            <input type="text" id="umowa" value={user.umowa} onChange={handleChange} />
            {errors.umowa && <span className={styles.error}>{errors.umowa}</span>}
          </section>
        </div>
        <div className={styles.content}>
          <section className={styles.contentSection}>
            <label htmlFor="adres">Adres</label>
            <input type="text" id="adres" value={user.adres} onChange={handleChange} />
            {errors.adres && <span className={styles.error}>{errors.adres}</span>}
          </section>
        </div>
        <div className={styles.content}>
          <section className={styles.contentSection}>
            <label htmlFor="number">Numer Telefonu</label>
            <input type="text" id="number" value={user.number} onChange={handleChange} />
            {errors.number && <span className={styles.error}>{errors.number}</span>}
          </section>
          <section className={styles.contentSection}>
            <label htmlFor="hired">Zatrudniony</label>
            <input type="date" id="hired" value={user.hired} onChange={handleChange} />
            {errors.hired && <span className={styles.error}>{errors.hired}</span>}
          </section>
        </div>
        <div className={styles.buttons}>
          <button onClick={onClose}>Zamknij</button>
          <button onClick={handleSave}>Zapisz</button>
        </div>
      </div>
    </div>
  );
};
