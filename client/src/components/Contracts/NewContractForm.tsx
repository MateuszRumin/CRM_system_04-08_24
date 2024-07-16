import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewContract.module.css';
import CheckboxIcon from '../../../public/icons/checkbox.svg';
import SearchIcon from '../../../public/icons/Search_White.svg';
import ImportIcon from '../../../public/icons/File_Upload.svg';
import EditFileIcon from '../../../public/icons/File_Edit.svg';

type OptionKeys = 'link' | 'firma' | 'osobaPrywatna';

export const NewContractForm = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<Record<OptionKeys, boolean>>({
    link: true,
    firma: true,
    osobaPrywatna: false,
  });
  const handleCancel = () => {
    navigate(-1); 
  };
  useEffect(() => {
    setSelectedOptions(prevState => ({
      ...prevState,
      firma: true,
      osobaPrywatna: false,
    }));
  }, []);

  const toggleOption = (option: OptionKeys) => {
    if (option === 'link') {
      setSelectedOptions(prevState => ({
        ...prevState,
        link: !prevState.link
      }));
    }
  };

  const handleOptionSelection = (option: OptionKeys) => {
    if (option === 'firma' && !selectedOptions.firma) {
      setSelectedOptions({
        link: selectedOptions.link,
        firma: true,
        osobaPrywatna: false,
      });
    } else if (option === 'osobaPrywatna' && !selectedOptions.osobaPrywatna) {
      setSelectedOptions({
        link: selectedOptions.link,
        firma: false,
        osobaPrywatna: true,
      });
    }
  };


return (
  <div className={styles.body}>
          <div className={styles.header_container}>
          <div className={styles.title}>Nowa Umowa</div>
          <div className={styles.button_container}>
            <div className={styles.save_button}>
              
              <button className={styles.save_button_anuluj}>
                <div className={styles.anuluj_button_text}>Wyślij Umowę do klienta</div>
              </button>
              <button className={styles.save_button_anuluj} onClick={handleCancel}>
                <div className={styles.anuluj_button_text}>Anuluj</div>
              </button>
              <button className={styles.save_button_inner} >
                <div className={styles.save_button_text}>Zapisz</div>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.ogolne_container}>
    <div className={styles.header_ogolne}>
        <div className={styles.text_ogolne}>Ogólne</div>
    </div>
    <div className={styles.ogolne_content}>
        <div className={styles.ogolne_left_column}>
            <div className={styles.ogolne_row}>
                <div className={styles.ogolne_column}>
                    <div className={styles.header_input}>Wybierz schemat:</div>
                    <select className={styles.input}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
            </div>
            <div className={styles.ogolne_row}>
                <div className={styles.ogolne_column}>
                    <div className={styles.header_input}>Email odbiorcy</div>
                    <input className={styles.input} />
                </div>
            </div>
            <div className={styles.ogolne_row}>
                <div className={styles.ogolne_column}>
                    <div className={styles.header_input}>Wynagrodzenie</div>
                    <select className={styles.input}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.checkboxContainer}>
                  <div className={styles.option} onClick={() => toggleOption('link')}>
                  <div className={styles.checkbox}>
                    {selectedOptions.link && <img src={CheckboxIcon} alt="Checkbox Icon" />}
                  </div>
                    <div className={styles.optionText}>Dołącz Jednorazowy Link do Podpisu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ogolne_right_column}>
            <div className={styles.header_input}>Dodaj dopiski</div>
            <textarea className={styles.input_text_area}></textarea>
          </div>
        </div>
      </div>



      <div className={styles.ogolne_container}>
        <div className={styles.header_ogolne}>
          <div className={styles.text_ogolne}>Dane klienta</div>
          {selectedOptions.firma && <div className={styles.pobierz_z_regon}>POBIERZ DANE Z REGON</div>}
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
          <div className={styles.checkboxContainer}>
              <div className={styles.checkboxOption} onClick={() => handleOptionSelection('firma')}>
                <div className={styles.checkbox}>
                  {selectedOptions.firma && <img src={CheckboxIcon} alt="Checkbox Icon" />}
                </div>
                <div className={styles.optionText}>Firma</div>
              </div>
              <div className={styles.checkboxOption} onClick={() => handleOptionSelection('osobaPrywatna')}>
                <div className={styles.checkbox}>
                  {selectedOptions.osobaPrywatna && <img src={CheckboxIcon} alt="Checkbox Icon" />}
                </div>
                <div className={styles.optionText}>Osoba prywatna</div>
              </div>
            </div>
          </div>
          <div className={styles.ogolne_column}></div>
        </div>

        {selectedOptions.firma && (
          <>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>NIP</div>
                <input className={styles.input} />
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>REGON</div>
                <input className={styles.input} />
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Nazwa Firmy</div>
                <input className={styles.input} />
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>KRS</div>
                <input className={styles.input} />
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

        {selectedOptions.osobaPrywatna && (
          <>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Imię</div>
                <input className={styles.input} />
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Nazwisko</div>
                <input className={styles.input} />
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


      <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.buttonGroup}>
                    <button className={styles.button}>
                        <div className={styles.icon}>
                            <img src={ImportIcon} alt="Import" />
                        </div>
                        <div className={styles.text}>Importuj szablon</div>
                    </button>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.button}>
                        <div className={styles.icon}>
                        <img src={ImportIcon} alt="Import" />
                        </div>
                        <div className={styles.text}>Importuj umowę</div>
                    </button>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.largeButton}>
                        <div className={styles.icon}>
                        <img src={EditFileIcon} alt="Import" />
                        </div>
                        <div className={styles.text}>Zapisz wersję roboczą</div>
                    </button>
                </div>
                <button className={styles.previewButton}>
                    <div className={styles.icon}>
                    <img src={SearchIcon} alt="Import" />
                    </div>
                    <div className={styles.previewText}>Podgląd umowy</div>
                </button>
            </div>
        </div>
    </div>
  );
};

export default NewContractForm;