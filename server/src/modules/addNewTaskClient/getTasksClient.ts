import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

exports.getTasksClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');

    try {
        const { client_id } = req.params;

        // Znajdź wszystkie zadania powiązane z danym klientem
        const clientTasks = await prisma.ClientTasks.findMany({
            where: {
                client_id: Number(client_id),
            },
            include: {
                Task: {
                    include: {
                        Statuses: true,
                        Users: true,
                    },
                },
            },
        });

        // Jeśli nie znaleziono żadnych zadań dla danego klienta
        if (clientTasks.length === 0) {
            const response: IResponse = {
                status: 'info',
                display: true,
                error: null,
                message: 'Nie znaleziono żadnych zadań dla tego klienta',
                devmessage: 'No tasks found for this client',
                data: null,
            };
            return res.status(404).json(response);
        }

        const response: IResponse = {
            status: 'success',
            display: true,
            error: null,
            message: 'Znaleziono zadania dla klienta',
            devmessage: 'Successfully retrieved tasks for the client',
            data: clientTasks,
        };

        res.status(200).json(response);
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd podczas pobierania zadań dla klienta',
            devmessage: `${error}`,
            data: null,
        };

        res.status(500).json(response);
    }
};
