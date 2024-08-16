import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './NewInvoiceForm.module.css';
import CheckboxIcon from '../../../public/icons/checkbox.svg';
import MinusIcon from '../../../public/icons/Minus_Square.svg';
import AddIcon from '../../../public/icons/Add_Plus_Square.svg';
import { useNavigate } from 'react-router-dom';

interface Project {
  project_id: number;
  name: string;
  status_id: number;
}

interface Client {
  client_id: number;
  nip: string;
  regon: string;
  company_name: string;
  krs: string;
  address: string;
  displayName: string;
  Project: Project[];
  first_name?: string; 
  second_name?: string;
}

export const NewInvoiceForm = () => {
  const navigate = useNavigate();
  const [number] = useState('');
  const [type, setType] = useState<number>();
  const [issueDate, setIssueDate] = useState('');
  const [dueDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString());
  const [statusId, setStatusId] = useState<number | undefined>();
  const [selectedOption, setSelectedOption] = useState<'firma' | 'osobaPrywatna'>('firma');
  const [serviceSections, setServiceSections] = useState<{ id: string; product_name: string; unit_price: number; product_count: number; prize: number; tax: number }[]>([
    { id: 'section1', product_name: '', unit_price: 0, product_count: 1, prize: 0, tax: 0 }
  ]);
  const [clients, setClients] = useState<Client[]>([]);
  const [privateClients, setPrivateClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [availableProjects, setAvailableProjects] = useState<{ project_id: number; name: string; }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [clientNIP, setClientNIP] = useState('');
  const [clientRegon, setClientRegon] = useState('');
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientKRS, setClientKRS] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientFirstName, setClientFirstName] = useState(''); 
  const [clientLastName, setClientLastName] = useState('');

  const [summary, setSummary] = useState({
    prize_netto: 0,
    prize_brutto: 0,
    tax_ammount: 0,
    comments: '',
  });
  const [invoiceTypes, setInvoiceTypes] = useState<{ invoice_type_id: number; invoice_type: string; }[]>([]);

  const fetchStatusId = async () => {
    try {
      const response = await axios.get('http://localhost:3000/statuses/invoice');
      const statuses = response.data;
      const status = statuses.find((status: { name: string }) => status.name === 'Nie oplacona' || 'Nie opłacona');

      if (status) {
        setStatusId(status.status_id);
      } else {
        console.error('Status "Nie oplacona" nie został znaleziony');
      }
    } catch (error) {
      console.error('Błąd przy pobieraniu statusów:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/client');
      const clientsData = response.data.data;

      const filteredClientsFirma = clientsData.filter((client: { client_type: string; }) => client.client_type === 'Firma');
      const filteredClientsPrywatny = clientsData.filter((client: { client_type: string; }) => client.client_type === 'Prywatny');

      const clientOptionsFirma = filteredClientsFirma.map((client: { client_id: number; nip: string; regon: string; company_name: string; krs: string; address: string; first_name: string; second_name: string; Project: Project[] }) => ({
        client_id: client.client_id,
        nip: client.nip,
        regon: client.regon,
        company_name: client.company_name,
        krs: client.krs,
        address: client.address,
        displayName: `${client.first_name} ${client.second_name} - ${client.company_name}`,
        Project: client.Project
      }));

      const clientOptionsPrywatny = filteredClientsPrywatny.map((client: { client_id: number; first_name: string; second_name: string; address: string; Project: Project[] }) => ({
        client_id: client.client_id,
        first_name: client.first_name,
        second_name: client.second_name,
        address: client.address,
        displayName: `${client.first_name} ${client.second_name}`,
        Project: client.Project
      }));

      setClients(clientOptionsFirma);
      setPrivateClients(clientOptionsPrywatny);
    } catch (error) {
      console.error('Błąd podczas pobierania klientów:', error);
    }
  };


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setIssueDate(today);

    axios.get('http://localhost:3000/invoices/settings')
      .then(response => {
        setInvoiceTypes(response.data.data.invoiceTypes);
      })
      .catch(error => {
        console.error('Error fetching invoice types:', error);
      });

    fetchStatusId();
    fetchClients();
  }, []);

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = Number(event.target.value);
    setSelectedClientId(clientId);

    let selectedClient = clients.find(client => client.client_id === clientId);
    if (selectedOption === 'osobaPrywatna') {
      selectedClient = privateClients.find(client => client.client_id === clientId);
    }

    if (selectedClient) {
      setAvailableProjects(selectedClient.Project);
      
      if (selectedOption === 'firma') {
        setClientNIP(selectedClient.nip || '');
        setClientRegon(selectedClient.regon || '');
        setClientCompanyName(selectedClient.company_name || '');
        setClientKRS(selectedClient.krs || '');
      } else {
        setClientFirstName(selectedClient.first_name || '');
        setClientLastName(selectedClient.second_name || '');
      }
      setClientAddress(selectedClient.address || '');
    } else {
      setAvailableProjects([]);
      setClientNIP('');
      setClientRegon('');
      setClientCompanyName('');
      setClientKRS('');
      setClientFirstName('');
      setClientLastName('');
      setClientAddress('');
    }
  };



  const areFieldsDisabled = Boolean(selectedClientId);
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(Number(event.target.value));
  };



  // Funkcje obsługujące zmiany w polach
  const handleNIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientNIP(event.target.value);
  };

  const handleRegonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientRegon(event.target.value);
  };

  const handleCompanyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientCompanyName(event.target.value);
  };

  const handleKRSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientKRS(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientAddress(event.target.value);
  };
  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientLastName(event.target.value);
  };

  const toggleOption = (option: 'firma' | 'osobaPrywatna') => {
    setSelectedOption(option);
  };

  const handleAddSection = () => {
    const newSectionId = `section${serviceSections.length + 1}`;
    setServiceSections([
      ...serviceSections,
      { id: newSectionId, product_name: '', unit_price: 0, product_count: 1, prize: 0, tax: 0 }
    ]);
  };

  const handleRemoveSection = (sectionId: string) => {
    const newSections = serviceSections.filter((section) => section.id !== sectionId);
    setServiceSections(newSections);
    calculateSummary(newSections);
  };

  const handleInputChange = (sectionId: string, field: string, value: string | number) => {
    const newSections = serviceSections.map((section) => {
      if (section.id === sectionId) {
        const updatedSection = { ...section, [field]: value };

        if (field === 'unit_price' || field === 'product_count') {
          const prize = updatedSection.unit_price * updatedSection.product_count;
          const tax = prize * 0.23; // Przykład kalkulacji podatku VAT 23%
          updatedSection.prize = prize;
          updatedSection.tax = tax;
        }

        return updatedSection;
      }
      return section;
    });

    setServiceSections(newSections);
    calculateSummary(newSections);
  };

  const calculateSummary = (sections: typeof serviceSections) => {
    const prize_netto = sections.reduce((total, section) => total + section.prize, 0);
    const tax_ammount = sections.reduce((total, section) => total + section.tax, 0);
    const prize_brutto = prize_netto + tax_ammount;

    setSummary({
      ...summary,
      prize_netto,
      prize_brutto,
      tax_ammount,
    });
  };

  function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  

  const handleSave = async () => {
    if (validateForm()) {
        try {
            let clientId = selectedClientId;
            let projectId = selectedProjectId;

            // Jeśli klient nie jest wybrany, zapisz nowego klienta
            if (!selectedClientId) {
                console.log('Fetching client statuses...');
                const clientStatusResponse = await axios.get('http://localhost:3000/statuses/client');
                const clientStatuses = clientStatusResponse.data;
                const clientStatus = clientStatuses.find((status: { status_type: string, name: string }) => 
                    status.name === 'W trakcie' && status.status_type === 'Klient'
                );

                if (!clientStatus) {
                    console.error('Status "W trakcie" dla klienta nie został znaleziony');
                    return;
                }

                console.log('Fetching project statuses...');
                const projectStatusResponse = await axios.get('http://localhost:3000/statuses/project');
                const projectStatuses = projectStatusResponse.data;
                const projectStatus = projectStatuses.find((status: { status_type: string, name: string }) => 
                    status.name === 'Nie rozpoczęty' && status.status_type === 'Projekt'
                );

                if (!projectStatus) {
                    console.error('Status "Nie rozpoczęty" dla projektu nie został znaleziony');
                    return;
                }

                console.log('Creating new client...');
                const newClientResponse = await axios.post('http://localhost:3000/client/new', {
                    client: {
                        user_id: 1,
                        status_id: clientStatus.status_id,
                        client_type: selectedOption === 'firma' ? 'Firma' : 'Prywatny',
                        first_name: clientFirstName,
                        second_name: clientLastName,
                        address: clientAddress,
                        regon: clientRegon,
                        nip: clientNIP,
                        krs: clientKRS,
                        company_name: clientCompanyName
                    }
                });

                // Tutaj uzyskujesz ID nowo dodanego klienta
                clientId = newClientResponse.data.data.client_id;

                console.log('Creating new project...');
                const randomString = generateRandomString(5); // Generowanie losowego ciągu
                const newProjectName = `Nowy projekt - ${randomString}`; // Dodanie losowego ciągu do nazwy projektu
                
                const newProjectResponse = await axios.post('http://localhost:3000/projects/new', {
                  name: newProjectName,
                  client_id: clientId,
                  status_id: projectStatus.status_id,
                  description: 'Opis nowego projektu',
                  projectDetails: {
                    cost: 10000.0,
                    deadline: new Date().toISOString()
                  }
                });

                projectId = newProjectResponse.data.project_id;
              }

            console.log('Creating new invoice...');
            const invoiceResponse = await axios.post('http://localhost:3000/invoices/newInvoice', {
                main: {
                    status_id: statusId,
                    invoice_type_id: type,
                    due_date: dueDate,
                },
                client: {
                    client_id: clientId,
                },
                summary,
            });

            const invoiceId = invoiceResponse.data.data.invoice_id;

            console.log('Adding products to invoice...');
            await axios.post('http://localhost:3000/invoices/addInvoiceProduct', {
                invoice_id: invoiceId,
                products: serviceSections.map(section => ({
                    project_id: projectId,
                    product_name: section.product_name,
                    unit_price: section.unit_price,
                    product_count: section.product_count,
                    prize: section.prize,
                    tax: section.tax,
                })),
            });

            console.log('Faktura oraz produkty zostały dodane pomyślnie');
            navigate(-1);
        } catch (error) {
            console.error('Błąd przy zapisywaniu faktury, klienta lub produktów:', error);
        }
    }
};

  
  

  

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(Number(event.target.value)); // Konwertowanie wartości na liczbę
  };



  const handleCancel = () => {
    navigate(-1);
  };


  const validateForm = () => {
    let isValid = true;
  
    if (!selectedClientId) {
      
    if (selectedOption === 'firma' && clientNIP && (!/^\d{10}$/.test(clientNIP))) {
      alert("NIP musi składać się z 10 cyfr.");
      isValid = false;
    }
  
    // Walidacja REGON (9 lub 14 cyfr)
    if (selectedOption === 'firma' && clientRegon && (!/^\d{9}$/.test(clientRegon) && !/^\d{14}$/.test(clientRegon))) {
      alert("REGON musi składać się z 9 lub 14 cyfr.");
      isValid = false;
    }
  
    // Walidacja KRS (10 cyfr)
    if (selectedOption === 'firma' && clientKRS && (!/^\d{10}$/.test(clientKRS))) {
      alert("KRS musi składać się z 10 cyfr.");
      isValid = false;
    }
    }
     // Walidacja sekcji usług/produktów
  const invalidSections = serviceSections.some(section => !section.product_name.trim());
  if (invalidSections) {
    alert("Wszystkie sekcje muszą mieć nazwę usługi/produktu.");
    isValid = false;
  }
  
    // Sprawdzenie, czy wszystkie wymagane pola są wypełnione
    if (selectedOption === 'firma') {
      if (!clientCompanyName || !clientAddress || !issueDate || !type || !clientNIP) {
        alert("Wszystkie wymagane pola muszą być uzupełnione.");
        isValid = false;
      }
    } else if (selectedOption === 'osobaPrywatna') {
      if (!clientFirstName || !clientLastName || !clientAddress || !issueDate || !type) {
        alert("Wszystkie wymagane pola muszą być uzupełnione.");
        isValid = false;
      }
    }
  
    return isValid;
  };
  
  

  return (
    <div className={styles.body}>
      <div className={styles.header_container}>
        <div className={styles.title}>Nowa Faktura</div>
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
            <select className={styles.input} value={type} onChange={handleTypeChange}>
              <option value="">Wybierz typ faktury</option>
              {invoiceTypes.map((invoiceType) => (
                <option key={invoiceType.invoice_type_id} value={invoiceType.invoice_type_id}>
                  {invoiceType.invoice_type}
                </option>
              ))}
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
                <div className={styles.header_input}>&nbsp;</div>
                <select className={styles.input} value={selectedClientId || ''} onChange={handleClientChange}>
            <option value="">Wybierz klienta</option>
            {clients.map(client => (
              <option key={client.client_id} value={client.client_id}>
                {client.displayName}
              </option>
            ))}
          </select>
              </div>
              <div className={`${styles.ogolne_column} ${selectedClientId ? styles.show : styles.hide}`}>
                <div className={styles.header_input}>&nbsp;</div>
                <select className={styles.input} value={selectedProjectId || ''} onChange={handleProjectChange}>
                  <option value="">Wybierz projekt</option>
                  {availableProjects.map(project => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.ogolne_row}>
        <div className={styles.ogolne_column}>
          <div className={styles.header_input}>NIP</div>
          <input className={styles.input} value={clientNIP} onChange={handleNIPChange}  disabled={areFieldsDisabled} />
        </div>
        <div className={styles.ogolne_column}>
          <div className={styles.header_input}>REGON</div>
          <input className={styles.input} value={clientRegon} onChange={handleRegonChange} disabled={areFieldsDisabled} />
        </div>
      </div>
      <div className={styles.ogolne_row}>
        <div className={styles.ogolne_column}>
          <div className={styles.header_input}>Nazwa Firmy</div>
          <input className={styles.input} value={clientCompanyName} onChange={handleCompanyNameChange} disabled={areFieldsDisabled} />
        </div>
        <div className={styles.ogolne_column}>
          <div className={styles.header_input}>KRS</div>
          <input className={styles.input} value={clientKRS} onChange={handleKRSChange}  disabled={areFieldsDisabled} />
        </div>
      </div>
      <div className={styles.ogolne_row}>
        <div className={styles.ogolne_column}>
          <div className={styles.header_input}>Adres Firmy</div>
          <input className={styles.input} value={clientAddress} onChange={handleAddressChange}  disabled={areFieldsDisabled} />
        </div>
        <div className={styles.ogolne_column}></div>
            </div>
          </>
        )}
        
        {selectedOption === 'osobaPrywatna' && (
        <>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>&nbsp;</div>
              <select className={styles.input} value={selectedClientId || ''} onChange={handleClientChange}>
                <option value="">Wybierz klienta</option>
                {privateClients.map(client => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.ogolne_column} ${selectedClientId ? styles.show : styles.hide}`}>
              <div className={styles.header_input}>&nbsp;</div>
              <select className={styles.input} value={selectedProjectId || ''} onChange={handleProjectChange}>
                <option value="">Wybierz projekt</option>
                {availableProjects.map(project => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.name}
                  </option>
                ))}
              </select>
              </div>
          </div>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Imię</div>
              <input className={styles.input} value={clientFirstName} onChange={handleFirstNameChange} disabled={areFieldsDisabled} />
            </div>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Nazwisko</div>
              <input className={styles.input} value={clientLastName} onChange={handleLastNameChange} disabled={areFieldsDisabled} />
            </div>
          </div>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Adres</div>
              <input className={styles.input} value={clientAddress} onChange={handleAddressChange} disabled={areFieldsDisabled} />
            </div>
            <div className={styles.ogolne_column}></div>
          </div>
        </>
      )}
      </div>

      {serviceSections.map((section) => (
        <div key={section.id} className={styles.ogolne_container}>
          <div className={styles.header_ogolne}>
            <div className={styles.text_ogolne}>Usługi / Produkty</div>
            <div className={styles.button_container}>
              <div className={styles.button_minus} onClick={() => handleRemoveSection(section.id)}>
                <img src={MinusIcon} alt="Przycisk Minus" />
              </div>
              {section.id === serviceSections[serviceSections.length - 1].id && (
                <div className={styles.button_add} onClick={handleAddSection}>
                  <img src={AddIcon} alt="Przycisk Add" />
                </div>
              )}
            </div>
          </div>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Nazwa usługi / Produktu</div>
              <input
                className={styles.input}
                value={section.product_name}
                onChange={(e) => handleInputChange(section.id, 'product_name', e.target.value)}
              />
            </div>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Ilość</div>
              <input
                type="number"
                className={styles.input}
                value={section.product_count}
                onChange={(e) => handleInputChange(section.id, 'product_count', +e.target.value)}
              />
            </div>
          </div>
          <div className={styles.ogolne_row}>
            <div className={styles.ogolne_column}>
              <div className={styles.rowContainer}>
                <div className={styles.container_cell}>
                  <div className={styles.header_input}>Cena jednostkowa</div>
                  <input
                    className={styles.input}
                    type="number"
                    value={section.unit_price}
                    onChange={(e) => handleInputChange(section.id, 'unit_price', +e.target.value)}
                  />
                </div>
                <div className={styles.container_cell}>
                  <div className={styles.header_input}>Kwota</div>
                  <input
                    className={styles.input}
                    type="number"
                    value={section.prize}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className={styles.ogolne_column}>
              <div className={styles.header_input}>Podatek VAT</div>
              <select
                className={styles.input}
                value={section.tax}
                onChange={(e) => handleInputChange(section.id, 'tax', +e.target.value)}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={8}>8%</option>
                <option value={23}>23%</option>
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
            <input className={styles.input} value={summary.prize_netto} readOnly />
          </div>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Suma VAT</div>
            <input className={styles.input} value={summary.tax_ammount} readOnly />
          </div>
        </div>
        <div className={styles.ogolne_row}>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Suma Brutto</div>
            <input className={styles.input} value={summary.prize_brutto} readOnly />
          </div>
          <div className={styles.ogolne_column}>
            <div className={styles.header_input}>Uwagi</div>
            <textarea
              className={styles.input_text_area}
              value={summary.comments}
              onChange={(e) => setSummary({ ...summary, comments: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceForm;