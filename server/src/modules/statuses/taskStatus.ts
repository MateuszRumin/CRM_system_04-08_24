import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectTaskStatuses = async (req: Request, res: Response) => {
    try {
        const taskStatuses = await prisma.statuses.findMany({
            where: {
                status_type: 'Zadanie'
            }
        });
        res.status(200).json(taskStatuses);
    } catch (error) {
        console.error('Error fetching task statuses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const { task_id, status_id } = req.params;

    try {
        const statusExists = await prisma.statuses.findUnique({
            where: { status_id: parseInt(status_id, 10) }
        });

        if (!statusExists) {
            return res.status(400).json({ error: 'Status not found' });
        }

        const updatedTask = await prisma.tasks.update({
            where: { task_id: parseInt(task_id, 10) },
            data: { status_id: parseInt(status_id, 10) }
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};