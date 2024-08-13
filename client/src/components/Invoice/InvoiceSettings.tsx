import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnOffSwitch from '../SwitchButton/OnOffSwitch';
import styles from './InvoiceSettings.module.css';
import axios from 'axios';

export const InvoiceSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); 
  };

  // Ogólne
  const [numeracjaFormat, setNumeracjaFormat] = useState('FV/{rok}/{miesiąc}/{numer}');
  const [biezacyNumerFaktury, setBiezacyNumerFaktury] = useState('');
  const [domyslnaWaluta, setDomyslnaWaluta] = useState('');
  const [szablonFaktury, setSzablonFaktury] = useState('klasyczny');
  const [terminPlatnosci, setTerminPlatnosci] = useState('');

  // Dane Firmy
  const [nazwaFirmy, setNazwaFirmy] = useState('');
  const [nip, setNip] = useState('');
  const [regon, setRegon] = useState('');
  const [adresFirmy, setAdresFirmy] = useState('');
  const [krs, setKrs] = useState('');
  const [error, setError] = useState('');

  // Automatyczne Generowanie Faktur
  const [autoGenerowanieFaktur, setAutoGenerowanieFaktur] = useState(false);
  const [czestotliwoscGenerowania, setCzestotliwoscGenerowania] = useState('');
  const [autoGenerateVat, setAutoGenerateVat] = useState(false);
  const [autoGenerateZaliczkowa, setAutoGenerateZaliczkowa] = useState(false);
  const [autoGenerateKoncowa, setAutoGenerateKoncowa] = useState(false);
  const [autoGenerateProforma, setAutoGenerateProforma] = useState(false);
  const [autoGenerateOkresowa, setAutoGenerateOkresowa] = useState(false);

  // Podatki i Opłaty
  const [procentZaliczkowy, setProcentZaliczkowy] = useState('');
  const [procentPodatku, setProcentPodatku] = useState('');
  const [rodzajOpodatkowania, setRodzajOpodatkowania] = useState('');
  const [domyslnaStawkaVAT, setDomyslnaStawkaVAT] = useState('');

  // Powiadomienia
  const [przypomnienieONiezaplacanych, setPrzypomnienieONiezaplacanych] = useState(false);
  const [czestotliwoscPowiadomienONiezaplacanych, setCzestotliwoscPowiadomienONiezaplacanych] = useState('');
  const [trescPowiadomien, setTrescPowiadomien] = useState('');
  const [kanalKomunikacjiEmail, setKanalKomunikacjiEmail] = useState(false);
  const [kanalKomunikacjiSMS, setKanalKomunikacjiSMS] = useState(false);
  const [kanalKomunikacjiPush, setKanalKomunikacjiPush] = useState(false);

  const handleAutoGenerowanieFakturChange = (checked: boolean) => {
    setAutoGenerowanieFaktur(checked);
    if (!checked) {
      // Jeśli główny checkbox jest OFF, resetujemy inne checkboxy
      setAutoGenerateVat(false);
      setAutoGenerateZaliczkowa(false);
      setAutoGenerateKoncowa(false);
      setAutoGenerateProforma(false);
      setAutoGenerateOkresowa(false);
    }
  };

  const handlePrzypomnienieONiezaplacanych = (checked: boolean) => {
    setPrzypomnienieONiezaplacanych(checked);
    if (!checked) {
      // Jeśli główny checkbox jest OFF, resetujemy inne checkboxy
      setKanalKomunikacjiEmail(false);
      setKanalKomunikacjiSMS(false);
      setKanalKomunikacjiPush(false);
    }
  };

  const handleAutoGenerateFakturaChange = (checked: boolean, type: string) => {
    if (autoGenerowanieFaktur) {
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
    }
  };

  // Walidacja numeru NIP
  const validateNIP = (nip) => {
    const nipPattern = /^\d{10}$/; // Zakładając, że NIP ma 10 cyfr
    return nipPattern.test(nip);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    // Ustaw wartość NIP, nie wprowadzaj walidacji na tym etapie
    setNip(value);
    // Resetowanie błędu, jeśli zmieniają się dane
    setError('');
  };

  const handleSave = async () => {
    // Prepare the data object
    const data = {
      invoiceTypes: [
        {
          invoice_type_id: 1, // VAT
          enabled: autoGenerateZaliczkowa,
        },
        {
          invoice_type_id: 2, // Zaliczkowa
          enabled: autoGenerateVat,
        },
        {
          invoice_type_id: 3, // okresowa
          enabled: autoGenerateOkresowa,
        },
        {
          invoice_type_id: 4, // koncowa
          enabled: autoGenerateKoncowa,
        },
        // {
        //   invoice_type_id: 5, // Okresowa
        //   enabled: autoGenerateOkresowa,
        // }
      ],
      companySettings: {
        company_id: 1, // Or other relevant IDs
        name: nazwaFirmy,
        address: adresFirmy,
        regon: regon,
        nip: nip,
        krs: krs,
      },
      invoiceSettings: {
        invoice_setting_id: 1,
        default_currency: domyslnaWaluta,
        payment_term: parseInt(terminPlatnosci, 10),
        periodic_auto_generate: autoGenerowanieFaktur,
        periodic_frequency: czestotliwoscGenerowania,
        email_notification: kanalKomunikacjiEmail,
        sms_notification: kanalKomunikacjiSMS,
        push_notification: kanalKomunikacjiPush,
        unpaid_reminder_enabled: przypomnienieONiezaplacanych,
        reminder_frequency: parseInt(czestotliwoscPowiadomienONiezaplacanych, 10),
        reminder_content: trescPowiadomien,
      },
      invoicePaymentSettings: {
        payment_setting_id: 1,
        advancement_rate: parseInt(procentZaliczkowy, 10),
        tax_rate: parseInt(procentPodatku, 10),
        tax_type: rodzajOpodatkowania,
        default_vat_amount: parseInt(domyslnaStawkaVAT, 10),
      }
    };

    try {
      const response = await fetch('http://localhost:3000/invoices/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // alert('Ustawienia zostały zapisane');
        console.log(data);
        // navigate('/some-path');
      } else {
        alert('Wystąpił błąd podczas zapisywania ustawień');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Wystąpił błąd podczas zapisywania ustawień');
    }
  };

  const handleFetchCompanyData = async () => {

    if (!validateNIP(nip)) {
      setError('Numer NIP musi zawierać tylko cyfry i mieć 10 cyfr.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/client/fetch-regon-data', { nip });
      const { name, address, regon, krs } = response.data;

      setNazwaFirmy(name);
      setAdresFirmy(address);
      setRegon(regon);
      setKrs(krs);
      setError('');
    } catch (error) {
      setError('Wystąpił błąd podczas pobierania danych.');
    }
  };

  // Load data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/invoices/settings');
        const data = response.data.data; 
        
        console.log('Ustawienia faktur:', data);
    
        // Dane Firmy
        if (data.companySettings) {
          setNazwaFirmy(data.companySettings.name);
          setNip(data.companySettings.nip);
          setRegon(data.companySettings.regon);
          setAdresFirmy(data.companySettings.address);
          setKrs(data.companySettings.krs);
        } else {
          console.warn('Brak danych dla companySettings');
        }
    
        // ogolne ustawienia Generowanie Faktur
        if (data.invoiceSettings) {
          setAutoGenerowanieFaktur(data.invoiceSettings.periodic_auto_generate);
          setCzestotliwoscGenerowania(data.invoiceSettings.periodic_frequency);
          setDomyslnaWaluta(data.invoiceSettings.default_currency);
          setTerminPlatnosci(data.invoiceSettings.payment_term);
          setPrzypomnienieONiezaplacanych(data.invoiceSettings.unpaid_reminder_enabled);
          setCzestotliwoscPowiadomienONiezaplacanych(data.invoiceSettings.reminder_frequency);
          setTrescPowiadomien(data.invoiceSettings.reminder_content);
          setKanalKomunikacjiEmail(data.invoiceSettings.email_notification);
          setKanalKomunikacjiSMS(data.invoiceSettings.sms_notification);
          setKanalKomunikacjiPush(data.invoiceSettings.push_notification);
        } else {
          console.warn('Brak danych dla invoice settings');
        }

        const invoiceMarker = data.invoiceMarkers.find(marker => marker.marker_id === 1);
        if (invoiceMarker) {
          setBiezacyNumerFaktury(invoiceMarker.current_number_sequence);
        } else {
          console.warn('Brak danych dla invoice marker z marker_id 1');
        }
    
        if (data.invoiceTypes) {
          setAutoGenerateVat(data.invoiceTypes.some(type => type.invoice_type_id === 2 && type.enabled) || false);
          setAutoGenerateZaliczkowa(data.invoiceTypes.some(type => type.invoice_type_id === 1 && type.enabled) || false);
          setAutoGenerateKoncowa(data.invoiceTypes.some(type => type.invoice_type_id === 4 && type.enabled) || false);
          setAutoGenerateProforma(data.invoiceTypes.some(type => type.invoice_type_id === 5 && type.enabled) || false);
          setAutoGenerateOkresowa(data.invoiceTypes.some(type => type.invoice_type_id === 3 && type.enabled) || false);
        } else {
          console.warn('Brak danych dla invoice types');
        }
    
        // Ustawienia Płatności
        if (data.invoicePaymentSettings) {
          setProcentZaliczkowy(data.invoicePaymentSettings.advancement_rate);
          setProcentPodatku(data.invoicePaymentSettings.tax_rate || '23');
          setRodzajOpodatkowania(data.invoicePaymentSettings.tax_type);
          setDomyslnaStawkaVAT(data.invoicePaymentSettings.default_vat_amount);
        } else {
          console.warn('Brak danych dla invoice payment settings');
        }
    
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.header_container}>
        <div className={styles.title}>Ustawienia</div>
        <div className={styles.button_container}>
          <div className={styles.save_button}>
            <button className={styles.save_button_anuluj} onClick={handleCancel}>
              <div className={styles.anuluj_button_text}>Anuluj</div>
            </button>
            <button className={styles.save_button_inner} onClick={handleSave}>
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
                  <option value="inne">Inne...</option>
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
                  <option value="PLN">PLN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Szablon Faktury:</div>
                <select className={styles.input} value={szablonFaktury} onChange={(e) => setSzablonFaktury(e.target.value)}>
                  <option value="klasyczny">Klasyczny</option>
                  <option value="inne">Inne...</option>
                </select>
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Termin płatności:</div>
                <select className={styles.input} value={terminPlatnosci} onChange={(e) => setTerminPlatnosci(e.target.value)}>
                  <option value="7">7 dni</option>
                  <option value="14">14 dni</option>
                  <option value="28">28 dni</option>
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
              <div className={styles.pobierz_z_regon} onClick={handleFetchCompanyData}>POBIERZ DANE Z REGON</div>
            </div>
            <div className={styles.ogolne_row}>
                  <div className={styles.ogolne_column}>
                    
                    <div className={styles.header_input}>Nazwa Firmy:</div>
                    <input className={styles.input} value={nazwaFirmy} onChange={(e) => setNazwaFirmy(e.target.value)} />                  </div>
                  
                </div>
                <div className={styles.ogolne_row}>
                  <div className={styles.ogolne_column}>
                  <div className={styles.header_input}>NIP:</div>
                  <input
                      className={styles.input}
                      value={nip}
                      onChange={handleChange}
                      placeholder="Wprowadź numer NIP"
                  />
                  {error && <p style={{ color: 'red' }}>{error}</p>}                  
                  </div>
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
              <OnOffSwitch checked={autoGenerowanieFaktur} onChange={(checked) => handleAutoGenerowanieFakturChange(checked)} />

              <div className={styles.ogolne_column2}>
                <div className={styles.header_input}>Częstotliwość generowania faktur okresowych:</div>
                <select className={styles.input} value={czestotliwoscGenerowania} onChange={(e) => setCzestotliwoscGenerowania(e.target.value)}>
                  <option value="tygodniowo">Tygodniowo</option>
                  <option value="miesiecznie">Miesięcznie</option>
                  <option value="kwartalnie">Kwartalnie</option>
                  <option value="rocznie">Rocznie</option>
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
                <div className={styles.header_input}>% Zaliczkowy</div>
                <input className={styles.input} value={procentZaliczkowy} onChange={(e) => setProcentZaliczkowy(e.target.value)} />
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>% Podatku</div>
                <input className={styles.input} value={procentPodatku} onChange={(e) => setProcentPodatku(e.target.value)} />
              </div>
            </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Rodzaj opodatkowania</div>
                <select className={styles.input} value={rodzajOpodatkowania} onChange={(e) => setRodzajOpodatkowania(e.target.value)}>
                  <option value="zwolniony">Zwolniony</option>
                  <option value="ogolny">Ogólny</option>
                  <option value="inne">Inny...</option>
                </select>
                
              </div>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Domyślna stawka VAT</div>
                <select className={styles.input} value={domyslnaStawkaVAT} onChange={(e) => setDomyslnaStawkaVAT(e.target.value)}>
                  <option value="0">0% VAT</option>
                  <option value="5">5% VAT</option>
                  <option value="8">8% VAT</option>
                  <option value="23">23% VAT</option>
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
              <div className={styles.header_input_wrapper}>
                <div className={styles.header_input}>Przypominanie o niezapłaconych fakturach:</div>
                <OnOffSwitch 
                  checked={przypomnienieONiezaplacanych} 
                  onChange={(checked) => handlePrzypomnienieONiezaplacanych(checked)}
                />
              </div>
            </div>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Częstotliwość powiadomień o nieopłaconych fakturach:</div>
              <select 
                className={styles.input} 
                value={czestotliwoscPowiadomienONiezaplacanych} 
                onChange={(e) => setCzestotliwoscPowiadomienONiezaplacanych(e.target.value)}
              >
                <option value="1">Co 1 dzień</option>
                <option value="3">Co 3 dni</option>
                <option value="7">Co 7 dni</option>
              </select>
            </div>
          </div>
            <div className={styles.ogolne_row}>
              <div className={styles.ogolne_column}>
                <div className={styles.header_input}>Treść powiadomień:</div>
                <input className={styles.input} value={trescPowiadomien} onChange={(e) => setTrescPowiadomien(e.target.value)} />
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
