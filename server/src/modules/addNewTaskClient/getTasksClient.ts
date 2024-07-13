import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getTasksClient = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    try {
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid clientId parameter' });
        }

        const clientTasks = await prisma.clientTasks.findMany({
            where: {
                client_id: id, 
            },
            include: {
                Task: {
                    include: {
                        Status: true, 
                    },
                },
            },
        });

        if (clientTasks.length === 0) {
            return res.status(404).json({ error: 'No tasks found for this client' });
        }

        const taskDetails = clientTasks.map((clientTask) => clientTask.Task);

        res.status(200).json(taskDetails);
    } catch (error) {
        console.error('Error fetching tasks for client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};