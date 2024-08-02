import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FilterSettingsModal.module.css';
import CheckboxIcon from '../../../public/icons/checkbox.svg';
import CalendarIcon from '../../../public/icons/Calendar.svg';

type OptionKeys = 'vat' | 'zaliczka' | 'koncowa' | 'wystawiona' | 'szkic' | 'oplacona' | 'nieoplacona' | 'oczekujeNaPlatnosc';

interface FilterSettingsProps {
  onClose: () => void;
}

const FilterSettingsModal: React.FC<FilterSettingsProps> = ({ onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<OptionKeys, boolean>>({
    vat: true,
    zaliczka: false,
    koncowa: false,
    wystawiona: true,
    szkic: false,
    oplacona: true,
    nieoplacona: false,
    oczekujeNaPlatnosc: true,
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const toggleOption = (option: OptionKeys) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [option]: !prevState[option]
    }));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Rodzaj Faktury:</div>
            <div className={styles.option} onClick={() => toggleOption('vat')}>
              <div className={styles.checkbox}>
                {selectedOptions.vat && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>VAT</div>
            </div>
            <div className={styles.option} onClick={() => toggleOption('zaliczka')}>
              <div className={styles.checkbox}>
                {selectedOptions.zaliczka && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Zaliczka</div>
            </div>
            <div className={styles.option} onClick={() => toggleOption('koncowa')}>
              <div className={styles.checkbox}>
                {selectedOptions.koncowa && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Końcowa</div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Data wystawienia:</div>
            <div className={styles.dateRange}>
              <div className={styles.dateContainer}>
                <div className={styles.dateLabel}>Od</div>
                <div className={styles.dateInput}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    customInput={<CustomInput />}
                  />
                </div>
              </div>
              <div className={styles.dateContainer}>
                <div className={styles.dateLabel}>Do</div>
                <div className={styles.dateInput}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    customInput={<CustomInput />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Status Faktury:</div>
            <div className={styles.option} onClick={() => toggleOption('wystawiona')}>
              <div className={styles.checkbox}>
                {selectedOptions.wystawiona && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Wystawiona</div>
            </div>
            <div className={styles.option} onClick={() => toggleOption('szkic')}>
              <div className={styles.checkbox}>
                {selectedOptions.szkic && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Szkic</div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Kwota faktury:</div>
            <div className={styles.dateRange}>
              <div className={styles.dateContainer}>
                <div className={styles.dateLabel}>Od</div>
                <div className={styles.dateInput}>
                  <input type="number" className={styles.inputField} />
                  
                </div>
                </div>
              <div className={styles.dateContainer}>
                <div className={styles.dateLabel}>Do</div>
                <div className={styles.dateInput}>
                  <input type="number" className={styles.inputField} />
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Status płatności:</div>
            <div className={styles.option} onClick={() => toggleOption('oplacona')}>
              <div className={styles.checkbox}>
                {selectedOptions.oplacona && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Opłacona</div>
            </div>
            <div className={styles.option} onClick={() => toggleOption('nieoplacona')}>
              <div className={styles.checkbox}>
                {selectedOptions.nieoplacona && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Nieopłacona</div>
            </div>
            <div className={styles.option} onClick={() => toggleOption('oczekujeNaPlatnosc')}>
              <div className={styles.checkbox}>
                {selectedOptions.oczekujeNaPlatnosc && <img src={CheckboxIcon} alt="Checkbox Icon" />}
              </div>
              <div className={styles.optionText}>Oczekuje na płatność</div>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.buttonCancel} onClick={onClose}>Anuluj</div>
            <div className={styles.buttonFilter}>Filtruj</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(({ value, onClick }, ref) => (
  <div className={styles.customInput} onClick={onClick} ref={ref}>
    <input
      type="text"
      value={value}
      readOnly
      className={styles.inputField}
    />
    <img src={CalendarIcon} alt="Calendar Icon" className={styles.calendarIcon} />
  </div>
));

export default FilterSettingsModal;
