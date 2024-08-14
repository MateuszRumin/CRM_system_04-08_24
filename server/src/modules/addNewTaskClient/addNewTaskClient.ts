import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

exports.addNewTaskClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');

    try {
        const user_id = req.body.user_id;
        const client_id = req.body.client_id;
        const taskDatas = req.body.tasks || [];

        if (taskDatas.length === 0) {
            return next(); // Jeśli nie ma zadań, przejdź do następnego middleware
        }

        for (let taskData of taskDatas) {
            const status = await prisma.Statuses.findFirst({
                select: { status_id: true },
                where: { status_type: 'Zadanie', name: taskData.status_name }
            });

            if (!status) {
                return res.status(404).json({ error: `Status '${taskData.status_name}' not found` });
            }

            let insertData = {
                status_id: status.status_id,
                task_text: taskData.task_text,
                user_id: user_id,
                task_name: taskData.task_name || undefined,
                deadline: taskData.deadline || undefined,
                created_at: taskData.created_at || undefined
            };

            let task = await prisma.Tasks.create({
                data: insertData
            });

            await prisma.ClientTasks.create({
                data: {
                    client_id: client_id,
                    task_id: task.task_id
                }
            });
        }

        next();

    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd dodawania zadań nowego klienta',
            devmessage: `${error}`,
            data: null
        };

        res.status(500).json(response);
    }
};

export const addNewTaskClientbyId = async (req: Request, res: Response, next: NextFunction) => {
    const { client_id } = req.params;
    const { user_id, tasks } = req.body;

    try {
        const clientId = parseInt(client_id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        const existingClient = await prisma.clients.findUnique({
            where: { client_id: clientId }
        });

        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        for (const taskData of tasks) {
            const statusId = parseInt(taskData.status_id, 10);
            if (isNaN(statusId)) {
                return res.status(400).json({ error: 'Invalid status_id parameter' });
            }

            let insertData: any = {
                status_id: statusId,
                task_text: taskData.task_text,
                user_id: user_id
            };

            if (taskData.task_name) insertData.task_name = taskData.task_name;
            if (taskData.deadline) insertData.deadline = taskData.deadline;
            if (taskData.created_at) insertData.created_at = taskData.created_at;

            const task = await prisma.tasks.create({
                data: insertData
            });

            await prisma.clientTasks.create({
                data: {
                    client_id: clientId,
                    task_id: task.task_id
                }
            });
        }

        res.status(201).json({ message: 'Tasks added successfully' });
    } catch (error) {
        console.error('Error adding tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};