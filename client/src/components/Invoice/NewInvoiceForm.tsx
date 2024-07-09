import React, { useState } from 'react';
import styles from './NewInvoiceForm.module.css';
import CheckboxIcon from '../../../public/icons/checkbox.svg';
import MinusIcon from '../../../public/icons/Minus_Square.svg';
import AddIcon from '../../../public/icons/Add_Plus_Square.svg';

interface NewInvoiceFormProps {
  onClose: () => void;
}

const NewInvoiceForm: React.FC<NewInvoiceFormProps> = ({ onClose }) => {
  const [number, setNumber] = useState(''); // State for invoice number
  const [client, setClient] = useState(''); // State for client
  const [type, setType] = useState(''); // State for invoice type (VAT, Zaliczka, Końcowa)
  const [issueDate, setIssueDate] = useState(''); // State for issue date
  const [dueDate, setDueDate] = useState(''); // State for due date
  const [amount, setAmount] = useState(''); // State for amount
  const [paymentStatus, setPaymentStatus] = useState(''); // State for payment status

  const [selectedOption, setSelectedOption] = useState<'firma' | 'osobaPrywatna'>('firma');
  const [serviceSections, setServiceSections] = useState<string[]>(['section1']); // Initial state with one section

  const toggleOption = (option: 'firma' | 'osobaPrywatna') => {
    setSelectedOption(option);
  };

  const handleAddSection = () => {
    const newSectionId = `section${serviceSections.length + 1}`;
    setServiceSections([...serviceSections, newSectionId]);
  };

  const handleRemoveSection = (sectionId: string) => {
    const newSections = serviceSections.filter((id) => id !== sectionId);
    setServiceSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to send data to API or process locally
    // Close the form after adding the invoice
    onClose();
  };

  return (
    <div className={styles.body}>
      <div className={styles.header_container}>
        <div className={styles.title}>Nowa Faktura</div>
        <div className={styles.button_container}>
          <div className={styles.save_button}>
            <button className={styles.save_button_inner} onClick={handleSubmit}>
              <div className={styles.save_button_text}>Zapisz</div>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.ogolne_container}>
        <div className={styles.header_ogolne}>
          <div className={styles.text_ogolne}>Ogólne</div>
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Numer Faktury (automatycznie)</div>
            <input className={styles.input} readOnly value={number || 'FV/06/2024/1001'} disabled />
          </div>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Data wystawienia</div>
            <input
              type="date"
              className={styles.input}
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Rodzaj Faktury</div>
            <select className={styles.input} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="VAT">VAT</option>
              <option value="Zaliczka">Zaliczka</option>
              <option value="Końcowa">Końcowa</option>
            </select>
          </div>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Termin płatności</div>
            <input className={styles.input} readOnly value='7 dni' disabled />
          </div>
        </div>
      </div>

      <div className={styles.ogolne_container}>
        <div className={styles.header_ogolne}>
          <div className={styles.text_ogolne}>Dane klienta</div>
          <div className={styles.pobierz_z_regon}>POBIERZ DANE Z REGON</div>
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxOption} onClick={() => toggleOption('firma')}>
                <div className={styles.checkbox}>
                  {selectedOption === 'firma' && <img src={CheckboxIcon} alt="Checkbox Icon" />}
                </div>
                <div className={styles.optionText}>Firma</div>
              </div>
              <div className={styles.checkboxOption} onClick={() => toggleOption('osobaPrywatna')}>
                <div className={styles.checkbox}>
                  {selectedOption === 'osobaPrywatna' && <img src={CheckboxIcon} alt="Checkbox Icon" />}
                </div>
                <div className={styles.optionText}>Osoba prywatna</div>
              </div>
            </div>
          </div>
          <div className={styles.ogolne_column}></div>
        </div>
        
        {selectedOption === 'firma' && (
          <>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>NIP</div>
                <input className={styles.input}/>
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>REGON</div>
                <input className={styles.input}/>
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Nazwa Firmy</div>
                <input className={styles.input}/>
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>KRS</div>
                <input className={styles.input}/>
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Adres Firmy</div>
                <input className={styles.input} />
              </div>
              <div className={styles.ogolne_column}></div>
            </div>
          </>
        )}
        
        {selectedOption === 'osobaPrywatna' && (
          <>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Imię</div>
                <input className={styles.input}/>
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Nazwisko</div>
                <input className={styles.input}/>
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Adres</div>
                <input className={styles.input} />
              </div>
              <div className={styles.ogolne_column}></div>
            </div>
          </>
        )}
      </div>

      {serviceSections.map((sectionId) => (
        <div key={sectionId} className={styles.ogolne_container}>
          <div className={styles.header_ogolne}>
            <div className={styles.text_ogolne}>Usługi / Produkty</div>
            <div className={styles.button_container}>
              <div className={styles.button_minus} onClick={() => handleRemoveSection(sectionId)}>
                <img src={MinusIcon} alt="Przycisk Minus" />
              </div>
              {sectionId === serviceSections[serviceSections.length - 1] && (
                <div className={styles.button_add} onClick={handleAddSection}>
                  <img src={AddIcon} alt="Przycisk Add" />
                </div>
              )}
            </div>
          </div>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Nazwa usługi / Produktu</div>
              <input className={styles.input} />
            </div>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Ilość</div>
              <input type="number" className={styles.input} />
            </div>
          </div>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.rowContainer}>
                <div className={styles.container_cell}>
                  <div className={styles.header_input}>Cena jednostkowa</div>
                  <input className={styles.input} />
                </div>
                <div className={styles.container_cell}>
                  <div className={styles.header_input}>Kwota</div>
                  <input className={styles.input} />
                </div>
              </div>
            </div>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Podatek VAT</div>
              <select className={styles.input}>
                <option value="23%">23%</option>
                <option value="8%">8%</option>
                <option value="5%">5%</option>
                <option value="0%">0%</option>
                <option value="ZW">ZW</option>
                <option value="NP">NP</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.separator}></div>

      <div className={styles.ogolne_container}>
        <div className={styles.header_ogolne}>
          <div className={styles.text_ogolne}>Podsumowanie</div>
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Suma Netto</div>
            <input className={styles.input} readOnly disabled/>
          </div>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Suma VAT</div>
            <input className={styles.input} readOnly disabled/>
          </div>
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Suma Brutto</div>
            <input className={styles.input} readOnly disabled/>
          </div>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Uwagi</div>
            <textarea className={styles.input_text_area}></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceForm;
