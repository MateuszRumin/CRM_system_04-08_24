import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnOffSwitch from '../SwitchButton/OnOffSwitch';
import styles from './InvoiceSettings.module.css';

export const InvoiceSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); 
  };

  // Ogólne
  const [numeracjaFormat, setNumeracjaFormat] = useState('FV/{rok}/{miesiąc}/{numer}');
  const [biezacyNumerFaktury, setBiezacyNumerFaktury] = useState('1001');
  const [domyslnaWaluta, setDomyslnaWaluta] = useState('$USD');
  const [szablonFaktury, setSzablonFaktury] = useState('Klasyczny');
  const [terminPlatnosci, setTerminPlatnosci] = useState('7 dni');

  // Dane Firmy
  const [nazwaFirmy, setNazwaFirmy] = useState('');
  const [nip, setNip] = useState('');
  const [regon, setRegon] = useState('');
  const [adresFirmy, setAdresFirmy] = useState('');
  const [krs, setKrs] = useState('');

  // Automatyczne Generowanie Faktur
  const [autoGenerowanieFaktur, setAutoGenerowanieFaktur] = useState(false);
  const [czestotliwoscGenerowania, setCzestotliwoscGenerowania] = useState('Kwartalnie');
  const [autoGenerateVat, setAutoGenerateVat] = useState(false);
  const [autoGenerateZaliczkowa, setAutoGenerateZaliczkowa] = useState(false);
  const [autoGenerateKoncowa, setAutoGenerateKoncowa] = useState(false);
  const [autoGenerateProforma, setAutoGenerateProforma] = useState(false);
  const [autoGenerateOkresowa, setAutoGenerateOkresowa] = useState(false);

  const handleAutoGenerateFakturaChange = (checked: boolean, type: string) => {
    switch (type) {
      case 'VAT':
        setAutoGenerateVat(checked);
        break;
      case 'Zaliczkowa':
        setAutoGenerateZaliczkowa(checked);
        break;
      case 'Koncowa':
        setAutoGenerateKoncowa(checked);
        break;
      case 'Proforma':
        setAutoGenerateProforma(checked);
        break;
      case 'Okresowa':
        setAutoGenerateOkresowa(checked);
        break;
      default:
        break;
    }
  };

  // Podatki i Opłaty
  const [procentZaliczkowy, setProcentZaliczkowy] = useState('1');
  const [procentPodatku, setProcentPodatku] = useState('23% VAT');
  const [rodzajOpodatkowania, setRodzajOpodatkowania] = useState('Zwolniony');
  const [domyslnaStawkaVAT, setDomyslnaStawkaVAT] = useState('23% VAT');

  // Powiadomienia
  const [przypomnienieONiezaplacanych, setPrzypomnienieONiezaplacanych] = useState('1');
  const [czestotliwoscPowiadomienONiezaplacanych, setCzestotliwoscPowiadomienONiezaplacanych] = useState('Co 3 dni...');
  const [trescPowiadomien, setTrescPowiadomien] = useState('');
  const [kanalKomunikacjiEmail, setKanalKomunikacjiEmail] = useState(false);
  const [kanalKomunikacjiSMS, setKanalKomunikacjiSMS] = useState(false);
  const [kanalKomunikacjiPush, setKanalKomunikacjiPush] = useState(false);


  return (
    <div className={styles.body}>
      <div className={styles.header_container}>
        <div className={styles.title}>Ustawienia</div>
        <div className={styles.button_container}>
          <div className={styles.save_button}>
            <button className={styles.save_button_anuluj} onClick={handleCancel}>
              <div className={styles.anuluj_button_text}>Anuluj</div>
            </button>
            <button className={styles.save_button_inner}>
              <div className={styles.save_button_text}>Zapisz</div>
            </button>
          </div>
        </div>
      </div>


      <div className={styles.grid_container}>
        <div className={styles.grid_item}>
        <div className={styles.ogolne_container}>
            <div className={styles.header_ogolne}>
              <div className={styles.text_ogolne}>Ogólne</div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Format numeracji:</div>
                <select className={styles.input} value={numeracjaFormat} onChange={(e) => setNumeracjaFormat(e.target.value)}>
                  <option value="FV/{rok}/{miesiąc}/{numer}">{'FV/{rok}/{miesiąc}/{numer}'}</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Bieżący numer faktury:</div>
                <input className={styles.input} readOnly value={biezacyNumerFaktury} disabled />

              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Domyślna waluta dla faktur:</div>
                <select className={styles.input} value={domyslnaWaluta} onChange={(e) => setDomyslnaWaluta(e.target.value)}>
                  <option value="$USD">$USD</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Szablon Faktury:</div>
                <select className={styles.input} value={szablonFaktury} onChange={(e) => setSzablonFaktury(e.target.value)}>
                  <option value="Klasyczny">Klasyczny</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Termin płatności:</div>
                <select className={styles.input} value={terminPlatnosci} onChange={(e) => setTerminPlatnosci(e.target.value)}>
                  <option value="7 dni">7 dni</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                
              </div>
              <div className={styles.ogolne_column}>
                
              </div>
            </div>

          </div>
        </div>
        <div className={styles.grid_item}>
          <div className={styles.ogolne_container}>
            <div className={styles.header_ogolne}>
              <div className={styles.text_ogolne}>Dane Firmy</div>
              <div className={styles.pobierz_z_regon}>POBIERZ DANE Z REGON</div>
            </div>
            <div className={styles.ogolne_row}>
                  <div className={styles.ogolne_column}>
                    
                    <div className={styles.header_input}>Nazwa Firmy:</div>
                    <input className={styles.input} value={nazwaFirmy} onChange={(e) => setNazwaFirmy(e.target.value)} />                  </div>
                  
                </div>
                <div className={styles.ogolne_row}>
                  <div className={styles.ogolne_column}>
                  <div className={styles.header_input}>NIP:</div>
                  <input className={styles.input} value={nip} onChange={(e) => setNip(e.target.value)} />                  </div>
                  <div className={styles.ogolne_column}>
                  <div className={styles.header_input}>REGON:</div>
                  <input className={styles.input} value={regon} onChange={(e) => setRegon(e.target.value)} />                  </div>
                </div>
                <div className={styles.ogolne_row}>
                  <div className={styles.ogolne_column}>
                    <div className={styles.header_input}>Adres Firmy:</div>
                    <input className={styles.input} value={adresFirmy} onChange={(e) => setAdresFirmy(e.target.value)} />                  </div>
                  <div className={styles.ogolne_column}>
                    <div className={styles.header_input}>KRS:</div>
                    <input className={styles.input} value={krs} onChange={(e) => setKrs(e.target.value)} />                  </div>
                  
                </div>
          </div>
        </div>
        <div className={styles.grid_item}>
          <div className={styles.ogolne_container}>
            <div className={styles.header_ogolne}>
              <div className={styles.text_ogolne}>Automatyczne Generowanie Faktur</div>
            </div>
            <div className={styles.grid_container_two}>
              <div className={styles.header_input}>Automatyczne generowanie faktur okresowych:</div>
              <OnOffSwitch checked={autoGenerowanieFaktur} onChange={setAutoGenerowanieFaktur} />

              <div className={styles.ogolne_column2}>
                <div className={styles.header_input}>Częstotliwość generowania faktur okresowych:</div>
                <select className={styles.input} value={czestotliwoscGenerowania} onChange={(e) => setCzestotliwoscGenerowania(e.target.value)}>
                  <option value="Kwartalnie">Kwartalnie</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>

            <div className={styles.grid_container2}>
              <div className={styles.header_input}>VAT:</div>
              <OnOffSwitch checked={autoGenerateVat} onChange={(checked) => handleAutoGenerateFakturaChange(checked, 'VAT')} />

              <div className={styles.header_input}>Zaliczkowa:</div>
              <OnOffSwitch checked={autoGenerateZaliczkowa} onChange={(checked) => handleAutoGenerateFakturaChange(checked, 'Zaliczkowa')} />

              <div className={styles.header_input}>Końcowa:</div>
              <OnOffSwitch checked={autoGenerateKoncowa} onChange={(checked) => handleAutoGenerateFakturaChange(checked, 'Koncowa')} />

              <div className={styles.header_input}>Proforma:</div>
              <OnOffSwitch checked={autoGenerateProforma} onChange={(checked) => handleAutoGenerateFakturaChange(checked, 'Proforma')} />

              <div className={styles.header_input}>Okresowa:</div>
              <OnOffSwitch checked={autoGenerateOkresowa} onChange={(checked) => handleAutoGenerateFakturaChange(checked, 'Okresowa')} />
            </div>

            
            
            
          </div>
        </div>

        <div className={styles.grid_item}>
        <div className={styles.ogolne_container}>
            <div className={styles.header_ogolne}>
              <div className={styles.text_ogolne}>Podatki i Opłaty</div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Procent zaliczkowy</div>
                <select className={styles.input} value={procentZaliczkowy} onChange={(e) => setProcentZaliczkowy(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>% Podatku</div>
                <select className={styles.input} value={procentPodatku} onChange={(e) => setProcentPodatku(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>

              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Rodaj opodatkowania</div>
                <select className={styles.input} value={rodzajOpodatkowania} onChange={(e) => setRodzajOpodatkowania(e.target.value)}>
                  <option value="Zwolniony">Zwolniony</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Domyślna stawka VAT</div>
                <select className={styles.input} value={domyslnaStawkaVAT} onChange={(e) => setDomyslnaStawkaVAT(e.target.value)}>
                  <option value="23% VAT">23% VAT</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
    
        <div className={`${styles.grid_item} ${styles.large}`}><div className={styles.ogolne_container}>
            <div className={styles.header_ogolne}>
              <div className={styles.text_ogolne}>Powiadomienia</div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Przypominanie o niezapłaconych fakturach:</div>
                <select className={styles.input} value={przypomnienieONiezaplacanych} onChange={(e) => setPrzypomnienieONiezaplacanych(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Częstotliwość powiadomień o nieopłaconych fakturach:</div>
                <select className={styles.input} value={czestotliwoscPowiadomienONiezaplacanych} onChange={(e) => setCzestotliwoscPowiadomienONiezaplacanych(e.target.value)}>
                  <option value="Co 3 dni...">Co 3 dni...</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>

              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Treść powiadomień:</div>
                <select className={styles.input} value={trescPowiadomien} onChange={(e) => setTrescPowiadomien(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Kanał komunikacji:</div>
                <div className={styles.kanal_komunikacji}>
                  <div className={styles.kanal_komunikacji_child}>
                    <div>E-mail:</div>
                    <div>
                    <OnOffSwitch checked={kanalKomunikacjiEmail} onChange={(checked) => setKanalKomunikacjiEmail(checked)} />
                    </div>
                  </div>
                  <div className={styles.kanal_komunikacji_child}>
                    <div>SMS:</div>
                    <div>
                    <OnOffSwitch checked={kanalKomunikacjiSMS} onChange={(checked) => setKanalKomunikacjiSMS(checked)} />
                    </div>
                  </div>
                  <div className={styles.kanal_komunikacji_child}>
                    <div>Push:</div>
                    <div>
                    <OnOffSwitch checked={kanalKomunikacjiPush} onChange={(checked) => setKanalKomunikacjiPush(checked)} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          </div>
    </div>




    </div>
  );
};
