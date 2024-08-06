import axios from 'axios';
import xml2js from 'xml2js';
import { Request, Response } from 'express';

const apiKey = 'a001e1f2bcdf414abc83';
const wsdlUrl = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';

// Funkcja czyszcząca odpowiedź z nagłówków MIME
const cleanXML = (xmlString: string) => {
    // Znajdź początek tagu XML
    const startTagIndex = xmlString.indexOf('<s:Envelope');
    if (startTagIndex === -1) {
        return '';
    }
    return xmlString.substring(startTagIndex).trim();
};

export const fetchRegonData = async (req: Request, res: Response) => {
    const { nip } = req.body;

    try {
        // Logowanie
        const loginResponse = await axios.post(wsdlUrl, `
            <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                xmlns:ns="http://CIS/BIR/PUBL/2014/07">
                <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                    <wsa:To>${wsdlUrl}</wsa:To>
                    <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj</wsa:Action>
                </soap:Header>
                <soap:Body>
                    <ns:Zaloguj>
                        <ns:pKluczUzytkownika>${apiKey}</ns:pKluczUzytkownika>
                    </ns:Zaloguj>
                </soap:Body>
            </soap:Envelope>
        `, {
            headers: { 'Content-Type': 'application/soap+xml' }
        });

        console.log('Login Response:', loginResponse.data);

        const parser = new xml2js.Parser();
        const loginResponseClean = cleanXML(loginResponse.data);
        const loginResult = await parser.parseStringPromise(loginResponseClean);
        const sid = loginResult['s:Envelope']['s:Body'][0]['ZalogujResponse'][0]['ZalogujResult'][0];

        // Wyszukiwanie danych
        const searchResponse = await axios.post(wsdlUrl, `
            <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
                <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                    <wsa:To>${wsdlUrl}</wsa:To>
                    <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty</wsa:Action>
                </soap:Header>
                <soap:Body>
                    <ns:DaneSzukajPodmioty>
                        <ns:pParametryWyszukiwania>
                            <dat:Nip>${nip}</dat:Nip>
                        </ns:pParametryWyszukiwania>
                    </ns:DaneSzukajPodmioty>
                </soap:Body>
            </soap:Envelope>
        `, {
            headers: { 
                'Content-Type': 'application/soap+xml',
                'sid': sid
            }
        });

        console.log('Search Response:', searchResponse.data);

        // Wyciąganie XML z odpowiedzi
        const searchResponseClean = cleanXML(searchResponse.data);
        const searchResult = await parser.parseStringPromise(searchResponseClean);

        // Parsowanie wyniku
        const daneSzukajPodmiotyResult = searchResult['s:Envelope']['s:Body'][0]['DaneSzukajPodmiotyResponse'][0]['DaneSzukajPodmiotyResult'][0];
        const daneXML = new xml2js.Parser();
        const daneResult = await daneXML.parseStringPromise(daneSzukajPodmiotyResult);

        if (daneResult && daneResult.root && daneResult.root.dane) {
            const companyData = daneResult.root.dane[0];

            // Przygotowanie danych
            const regon = companyData.Regon[0] || 'Brak danych REGON';
            const krs = companyData.Krs ? companyData.Krs[0] : 'Brak danych KRS'; // Upewnij się, że numer KRS jest dostępny
            const name = companyData.Nazwa[0] || 'Brak danych nazwy';
            const street = companyData.Ulica[0] || '';
            const number = companyData.NrNieruchomosci[0] || '';
            const city = companyData.Miejscowosc[0] || '';
            const postcode = companyData.KodPocztowy[0] || '';

            res.status(200).json({
                regon,
                krs,
                name,
                address: `${street} ${number}, ${city}, ${postcode}`,
                // Pozostałe dane
                wojewodztwo: companyData.Wojewodztwo[0] || 'Brak danych województwa',
                powiat: companyData.Powiat[0] || 'Brak danych powiatu',
                gmina: companyData.Gmina[0] || 'Brak danych gminy',
                typ: companyData.Typ[0] || 'Brak danych typu',
                silosID: companyData.SilosID[0] || 'Brak danych SilosID'
            });
        } else {
            res.status(404).json({ error: 'Dane nie zostały znalezione' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych z REGON' });
    }
};
