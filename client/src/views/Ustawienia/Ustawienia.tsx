import React from 'react';
import { InvoiceSettings } from '../../components/Invoice/InvoiceSettings'
import styles from './Ustawienia.module.css';

export const Ustawienia: React.FC = () => {
  return (
    <div className={styles.body}>
      <InvoiceSettings/>
    </div>
  );
};
