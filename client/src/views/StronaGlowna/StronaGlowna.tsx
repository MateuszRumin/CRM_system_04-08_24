import React from 'react';
import AdminPage from './AdminPage';
import UserPage from './UserPage';
import styles from './StronGlowna.module.css';

export const StronaGlowna = () => {
  const user = JSON.parse(localStorage.getItem('USER') || '{}');
  const userRole = user.role;

  return (
    <div className={styles.stronaGlownaContainer}>
      {userRole === 'Admin' ? <AdminPage /> : <UserPage />}
    </div>
  );
}

export default StronaGlowna;