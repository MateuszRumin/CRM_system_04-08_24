import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

exports.addNewClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const initData = req.body.client;

        console.log('Received client data:', initData);

        // Pobierz status klienta na podstawie status_id
        const status = await prisma.Statuses.findFirst({
            select: {
                status_id: true
            },
            where: {
                status_id: initData.status_id,
                status_type: "Klient",
            }
        });

        if (!status) {
            console.log('Status not found');
            return res.status(404).json({ error: 'Status not found' });
        }

        // dane do stworzenia nowego klienta
        const insertData = {
            status_id: status.status_id,
            user_id: initData.user_id,
            client_type: initData.client_type,
            first_name: initData.first_name,
            second_name: initData.second_name,
            address: initData.address,
            registration_date: initData.registration_date || new Date(),
            regon: initData.regon || 'brak',
            nip: initData.nip || 'brak',
            krs: initData.krs || 'brak',
            company_name: initData.company_name || 'brak'
        };

        console.log('Insert data:', insertData);

        // Stwórz nowego klienta
        const client = await prisma.Clients.create({
            data: insertData
        });

        console.log('Client created:', client);

        // Przekaż client_id dalej
        req.body.client_id = client.client_id;
        req.body.user_id = client.user_id;

        return next();

        // res.status(201).json({ message: 'Client added successfully', client });
    } catch (error) {
        console.error('Error adding new client:', error);

        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd dodawania nowego klienta',
            devmessage: `${error}`,
            data: null
        };

        res.status(500).json(response);
    }
};
