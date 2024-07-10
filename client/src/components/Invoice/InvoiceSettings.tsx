import React, { useState } from 'react';
import styles from './InvoiceSettings.module.css';

interface InvoiceSettingsProps {
  initialSetting1: string;
  initialSetting2: number;
  onSave: (settings: { setting1: string; setting2: number }) => void;
  isEditable: boolean;
}

export const InvoiceSettings: React.FC<InvoiceSettingsProps> = () => {


  return (
    <div className={styles.body}>
       <div className={styles.header_container}>
        <div className={styles.title}>Ustawienia Faktur</div>
        <div className={styles.button_container}>
          <div className={styles.save_button}>
            
            <button className={styles.save_button_anuluj}>
              <div className={styles.anuluj_button_text}>Anuluj</div>
            </button>
            <button className={styles.save_button_inner}>
              <div className={styles.save_button_text}>Zapisz</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
