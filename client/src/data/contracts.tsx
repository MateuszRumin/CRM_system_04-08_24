interface Contract {
    agreementNumber: string;
    client: string;
    project: string;
    creationDate: string;
    sentDate: string;
    signingDeadline: string;
    signingStatus: string;
}

const contracts: Contract[] = [
    {
        agreementNumber: '2023-001',
        client: 'Firma ABC',
        project: 'Projekt Alpha',
        creationDate: '2023/01/01',
        sentDate: '2023/01/02',
        signingDeadline: '2023/01/10',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-002',
        client: 'Zakład Produkcyjny XYZ',
        project: 'Projekt Beta',
        creationDate: '2023/01/03',
        sentDate: '2023/01/04',
        signingDeadline: '2023/01/14',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-003',
        client: 'Usługi IT 123',
        project: 'Projekt Gamma',
        creationDate: '2023/01/05',
        sentDate: '2023/01/06',
        signingDeadline: '2023/01/16',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-004',
        client: 'Agencja Reklamowa Kreatywni',
        project: 'Projekt Delta',
        creationDate: '2023/01/07',
        sentDate: '2023/01/08',
        signingDeadline: '2023/01/18',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-005',
        client: 'Firma Logistyczna Transporter',
        project: 'Projekt Epsilon',
        creationDate: '2023/01/09',
        sentDate: '2023/01/10',
        signingDeadline: '2023/01/20',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-006',
        client: 'Studio Graficzne PixelArt',
        project: 'Projekt Zeta',
        creationDate: '2023/01/11',
        sentDate: '2023/01/12',
        signingDeadline: '2023/01/22',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-007',
        client: 'Klinika Zdrowia i Urody',
        project: 'Projekt Eta',
        creationDate: '2023/01/13',
        sentDate: '2023/01/14',
        signingDeadline: '2023/01/24',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-008',
        client: 'Biuro Podróży Wakacje',
        project: 'Projekt Theta',
        creationDate: '2023/01/15',
        sentDate: '2023/01/16',
        signingDeadline: '2023/01/26',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-009',
        client: 'Centrum Medyczne Zdrowie',
        project: 'Projekt Iota',
        creationDate: '2023/01/17',
        sentDate: '2023/01/18',
        signingDeadline: '2023/01/28',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-010',
        client: 'Firma Konsultingowa Expert',
        project: 'Projekt Kappa',
        creationDate: '2023/01/19',
        sentDate: '2023/01/20',
        signingDeadline: '2023/01/30',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-011',
        client: 'Zakład Stolarski Drewno',
        project: 'Projekt Lambda',
        creationDate: '2023/01/21',
        sentDate: '2023/01/22',
        signingDeadline: '2023/02/01',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-012',
        client: 'Firma Budowlana Solid',
        project: 'Projekt Mu',
        creationDate: '2023/01/23',
        sentDate: '2023/01/24',
        signingDeadline: '2023/02/03',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-013',
        client: 'Przedsiębiorstwo Wodociągowe Aqua',
        project: 'Projekt Nu',
        creationDate: '2023/01/25',
        sentDate: '2023/01/26',
        signingDeadline: '2023/02/05',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-014',
        client: 'Spółka Energetyczna Power',
        project: 'Projekt Xi',
        creationDate: '2023/01/27',
        sentDate: '2023/01/28',
        signingDeadline: '2023/02/07',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-015',
        client: 'Biuro Rachunkowe Profit',
        project: 'Projekt Omicron',
        creationDate: '2023/01/29',
        sentDate: '2023/01/30',
        signingDeadline: '2023/02/09',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-016',
        client: 'Firma Informatyczna CodeMaster',
        project: 'Projekt Pi',
        creationDate: '2023/01/31',
        sentDate: '2023/02/01',
        signingDeadline: '2023/02/11',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-017',
        client: 'Agencja Eventowa FunTime',
        project: 'Projekt Rho',
        creationDate: '2023/02/02',
        sentDate: '2023/02/03',
        signingDeadline: '2023/02/13',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-018',
        client: 'Sklep Internetowy ShopNow',
        project: 'Projekt Sigma',
        creationDate: '2023/02/04',
        sentDate: '2023/02/05',
        signingDeadline: '2023/02/15',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-019',
        client: 'Restauracja Smacznie',
        project: 'Projekt Tau',
        creationDate: '2023/02/06',
        sentDate: '2023/02/07',
        signingDeadline: '2023/02/17',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-020',
        client: 'Firma Ochroniarska SafeGuard',
        project: 'Projekt Upsilon',
        creationDate: '2023/02/08',
        sentDate: '2023/02/09',
        signingDeadline: '2023/02/19',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-021',
        client: 'Zakład Mechaniczny AutoFix',
        project: 'Projekt Phi',
        creationDate: '2023/02/10',
        sentDate: '2023/02/11',
        signingDeadline: '2023/02/21',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-022',
        client: 'Firma Kurierska Speedy',
        project: 'Projekt Chi',
        creationDate: '2023/02/12',
        sentDate: '2023/02/13',
        signingDeadline: '2023/02/23',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-023',
        client: 'Szkoła Językowa Linguist',
        project: 'Projekt Psi',
        creationDate: '2023/02/14',
        sentDate: '2023/02/15',
        signingDeadline: '2023/02/25',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-024',
        client: 'Firma HR TalentFinder',
        project: 'Projekt Omega',
        creationDate: '2023/02/16',
        sentDate: '2023/02/17',
        signingDeadline: '2023/02/27',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-025',
        client: 'Zakład Chemiczny ChemTech',
        project: 'Projekt Alpha2',
        creationDate: '2023/02/18',
        sentDate: '2023/02/19',
        signingDeadline: '2023/03/01',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-026',
        client: 'Firma Transportowa MoveIt',
        project: 'Projekt Beta2',
        creationDate: '2023/02/20',
        sentDate: '2023/02/21',
        signingDeadline: '2023/03/03',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-027',
        client: 'Studio Mody FashionHouse',
        project: 'Projekt Gamma2',
        creationDate: '2023/02/22',
        sentDate: '2023/02/23',
        signingDeadline: '2023/03/05',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-028',
        client: 'Firma Ogrodnicza GreenThumb',
        project: 'Projekt Delta2',
        creationDate: '2023/02/24',
        sentDate: '2023/02/25',
        signingDeadline: '2023/03/07',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-029',
        client: 'Agencja Nieruchomości HomeFinder',
        project: 'Projekt Epsilon2',
        creationDate: '2023/02/26',
        sentDate: '2023/02/27',
        signingDeadline: '2023/03/09',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-030',
        client: 'Firma Reklamowa AdMaster',
        project: 'Projekt Zeta2',
        creationDate: '2023/02/28',
        sentDate: '2023/03/01',
        signingDeadline: '2023/03/11',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-031',
        client: 'Firma Telekomunikacyjna ConnectPlus',
        project: 'Projekt Eta2',
        creationDate: '2023/03/02',
        sentDate: '2023/03/03',
        signingDeadline: '2023/03/13',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-032',
        client: 'Zakład Przemysłowy SteelWorks',
        project: 'Projekt Theta2',
        creationDate: '2023/03/04',
        sentDate: '2023/03/05',
        signingDeadline: '2023/03/15',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-033',
        client: 'Firma Kosmetyczna BeautyCare',
        project: 'Projekt Iota2',
        creationDate: '2023/03/06',
        sentDate: '2023/03/07',
        signingDeadline: '2023/03/17',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-034',
        client: 'Centrum Handlowe ShopCenter',
        project: 'Projekt Kappa2',
        creationDate: '2023/03/08',
        sentDate: '2023/03/09',
        signingDeadline: '2023/03/19',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-035',
        client: 'Firma Cateringowa GoodFood',
        project: 'Projekt Lambda2',
        creationDate: '2023/03/10',
        sentDate: '2023/03/11',
        signingDeadline: '2023/03/21',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-036',
        client: 'Zakład Fotograficzny SnapShot',
        project: 'Projekt Mu2',
        creationDate: '2023/03/12',
        sentDate: '2023/03/13',
        signingDeadline: '2023/03/23',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-037',
        client: 'Firma Projektowa DesignHub',
        project: 'Projekt Nu2',
        creationDate: '2023/03/14',
        sentDate: '2023/03/15',
        signingDeadline: '2023/03/25',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '2023-038',
        client: 'Sklep Zoologiczny PetWorld',
        project: 'Projekt Xi2',
        creationDate: '2023/03/16',
        sentDate: '2023/03/17',
        signingDeadline: '2023/03/27',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '2023-039',
        client: 'Firma Detektywistyczna SafeInvestigations',
        project: 'Projekt Omicron2',
        creationDate: '2023/03/18',
        sentDate: '2023/03/19',
        signingDeadline: '2023/03/29',
        signingStatus: 'Oczekuje na podpis'
    },
    {
        agreementNumber: '2023-040',
        client: 'Zakład Produkcyjny MetalWorks',
        project: 'Projekt Pi2',
        creationDate: '2023/03/20',
        sentDate: '2023/03/21',
        signingDeadline: '2023/03/31',
        signingStatus: 'Podpisana'
    },   
    {
        agreementNumber: '001',
        client: 'Klient 1',
        project: 'Projekt 1',
        creationDate: '2023-01-01',
        sentDate: '2023-01-02',
        signingDeadline: '2023-01-10',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '002',
        client: 'Klient 2',
        project: 'Projekt 2',
        creationDate: '2023-01-03',
        sentDate: '2023-01-04',
        signingDeadline: '2023-01-12',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '003',
        client: 'Klient 3',
        project: 'Projekt 3',
        creationDate: '2023-01-05',
        sentDate: '2023-01-06',
        signingDeadline: '2023-01-14',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '004',
        client: 'Klient 4',
        project: 'Projekt 4',
        creationDate: '2023-01-07',
        sentDate: '2023-01-08',
        signingDeadline: '2023-01-16',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '005',
        client: 'Klient 5',
        project: 'Projekt 5',
        creationDate: '2023-01-09',
        sentDate: '2023-01-10',
        signingDeadline: '2023-01-18',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '006',
        client: 'Klient 6',
        project: 'Projekt 6',
        creationDate: '2023-01-11',
        sentDate: '2023-01-12',
        signingDeadline: '2023-01-20',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '007',
        client: 'Klient 7',
        project: 'Projekt 7',
        creationDate: '2023-01-13',
        sentDate: '2023-01-14',
        signingDeadline: '2023-01-22',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '008',
        client: 'Klient 8',
        project: 'Projekt 8',
        creationDate: '2023-01-15',
        sentDate: '2023-01-16',
        signingDeadline: '2023-01-24',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '009',
        client: 'Klient 9',
        project: 'Projekt 9',
        creationDate: '2023-01-17',
        sentDate: '2023-01-18',
        signingDeadline: '2023-01-26',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '010',
        client: 'Klient 10',
        project: 'Projekt 10',
        creationDate: '2023-01-19',
        sentDate: '2023-01-20',
        signingDeadline: '2023-01-28',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '011',
        client: 'Klient 11',
        project: 'Projekt 11',
        creationDate: '2023-01-21',
        sentDate: '2023-01-22',
        signingDeadline: '2023-01-30',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '012',
        client: 'Klient 12',
        project: 'Projekt 12',
        creationDate: '2023-01-23',
        sentDate: '2023-01-24',
        signingDeadline: '2023-02-01',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '013',
        client: 'Klient 13',
        project: 'Projekt 13',
        creationDate: '2023-01-25',
        sentDate: '2023-01-26',
        signingDeadline: '2023-02-03',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '014',
        client: 'Klient 14',
        project: 'Projekt 14',
        creationDate: '2023-01-27',
        sentDate: '2023-01-28',
        signingDeadline: '2023-02-05',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '015',
        client: 'Klient 15',
        project: 'Projekt 15',
        creationDate: '2023-01-29',
        sentDate: '2023-01-30',
        signingDeadline: '2023-02-07',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '016',
        client: 'Klient 16',
        project: 'Projekt 16',
        creationDate: '2023-01-31',
        sentDate: '2023-02-01',
        signingDeadline: '2023-02-09',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '017',
        client: 'Klient 17',
        project: 'Projekt 17',
        creationDate: '2023-02-02',
        sentDate: '2023-02-03',
        signingDeadline: '2023-02-11',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '018',
        client: 'Klient 18',
        project: 'Projekt 18',
        creationDate: '2023-02-04',
        sentDate: '2023-02-05',
        signingDeadline: '2023-02-13',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '019',
        client: 'Klient 19',
        project: 'Projekt 19',
        creationDate: '2023-02-06',
        sentDate: '2023-02-07',
        signingDeadline: '2023-02-15',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '020',
        client: 'Klient 20',
        project: 'Projekt 20',
        creationDate: '2023-02-08',
        sentDate: '2023-02-09',
        signingDeadline: '2023-02-17',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '021',
        client: 'Klient 21',
        project: 'Projekt 21',
        creationDate: '2023-02-10',
        sentDate: '2023-02-11',
        signingDeadline: '2023-02-19',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '022',
        client: 'Klient 22',
        project: 'Projekt 22',
        creationDate: '2023-02-12',
        sentDate: '2023-02-13',
        signingDeadline: '2023-02-21',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '023',
        client: 'Klient 23',
        project: 'Projekt 23',
        creationDate: '2023-02-14',
        sentDate: '2023-02-15',
        signingDeadline: '2023-02-23',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '024',
        client: 'Klient 24',
        project: 'Projekt 24',
        creationDate: '2023-02-16',
        sentDate: '2023-02-17',
        signingDeadline: '2023-02-25',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '025',
        client: 'Klient 25',
        project: 'Projekt 25',
        creationDate: '2023-02-18',
        sentDate: '2023-02-19',
        signingDeadline: '2023-02-27',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '026',
        client: 'Klient 26',
        project: 'Projekt 26',
        creationDate: '2023-02-20',
        sentDate: '2023-02-21',
        signingDeadline: '2023-03-01',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '027',
        client: 'Klient 27',
        project: 'Projekt 27',
        creationDate: '2023-02-22',
        sentDate: '2023-02-23',
        signingDeadline: '2023-03-03',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '028',
        client: 'Klient 28',
        project: 'Projekt 28',
        creationDate: '2023-02-24',
        sentDate: '2023-02-25',
        signingDeadline: '2023-03-05',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '029',
        client: 'Klient 29',
        project: 'Projekt 29',
        creationDate: '2023-02-26',
        sentDate: '2023-02-27',
        signingDeadline: '2023-03-07',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '030',
        client: 'Klient 30',
        project: 'Projekt 30',
        creationDate: '2023-02-28',
        sentDate: '2023-03-01',
        signingDeadline: '2023-03-09',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '031',
        client: 'Klient 31',
        project: 'Projekt 31',
        creationDate: '2023-03-02',
        sentDate: '2023-03-03',
        signingDeadline: '2023-03-11',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '032',
        client: 'Klient 32',
        project: 'Projekt 32',
        creationDate: '2023-03-04',
        sentDate: '2023-03-05',
        signingDeadline: '2023-03-13',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '033',
        client: 'Klient 33',
        project: 'Projekt 33',
        creationDate: '2023-03-06',
        sentDate: '2023-03-07',
        signingDeadline: '2023-03-15',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '034',
        client: 'Klient 34',
        project: 'Projekt 34',
        creationDate: '2023-03-08',
        sentDate: '2023-03-09',
        signingDeadline: '2023-03-17',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '035',
        client: 'Klient 35',
        project: 'Projekt 35',
        creationDate: '2023-03-10',
        sentDate: '2023-03-11',
        signingDeadline: '2023-03-19',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '036',
        client: 'Klient 36',
        project: 'Projekt 36',
        creationDate: '2023-03-12',
        sentDate: '2023-03-13',
        signingDeadline: '2023-03-21',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '037',
        client: 'Klient 37',
        project: 'Projekt 37',
        creationDate: '2023-03-14',
        sentDate: '2023-03-15',
        signingDeadline: '2023-03-23',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '038',
        client: 'Klient 38',
        project: 'Projekt 38',
        creationDate: '2023-03-16',
        sentDate: '2023-03-17',
        signingDeadline: '2023-03-25',
        signingStatus: 'Niepodpisana'
    },
    {
        agreementNumber: '039',
        client: 'Klient 39',
        project: 'Projekt 39',
        creationDate: '2023-03-18',
        sentDate: '2023-03-19',
        signingDeadline: '2023-03-27',
        signingStatus: 'Podpisana'
    },
    {
        agreementNumber: '040',
        client: 'Klient 40',
        project: 'Projekt 40',
        creationDate: '2023-03-20',
        sentDate: '2023-03-21',
        signingDeadline: '2023-03-29',
        signingStatus: 'Niepodpisana'
    },
];

export default contracts;
