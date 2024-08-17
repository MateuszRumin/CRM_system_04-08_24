import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

exports.addNewClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');

    try {
        const initData = req.body.client;

        if (!initData) {
            return res.status(400).json({ error: 'Brak danych klienta' });
        }

        // Sprawdź, czy NIP, KRS lub REGON już istnieją
        const existingClient = await prisma.Clients.findFirst({
            where: {
                OR: [
                    { nip: initData.nip },
                    { krs: initData.krs },
                    { regon: initData.regon }
                ]
            }
        });

        if (existingClient) {
            return res.status(409).json({ error: 'NIP, KRS lub REGON już istnieje' });
        }

        const status = await prisma.Statuses.findFirst({
            select: { status_id: true },
            where: {
                status_id: initData.status_id,
                status_type: "Klient"
            }
        });

        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }

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

        const client = await prisma.Clients.create({
            data: insertData
        });

        // Zwracanie odpowiedzi z client_id do klienta
        res.status(201).json({
            status: 'success',
            message: 'Klient dodany pomyślnie',
            data: {
                client_id: client.client_id,
                user_id: client.user_id
            }
        });

        // Przekazanie danych do kolejnego middleware'a
        req.body.client_id = client.client_id;
        req.body.user_id = client.user_id;

        res.status(200).json({
            status: 'success',
            data: {client},
        });

        return next();

    } catch (error) {
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
