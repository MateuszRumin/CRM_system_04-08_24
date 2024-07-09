import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteClientTask = async (req: Request, res: Response) => {
    const { task_id, client_id } = req.params;

    try {
        const taskId = parseInt(task_id, 10);
        const clientId = parseInt(client_id, 10);

        if (isNaN(taskId) || isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid task_id or client_id parameter' });
        }

        const existingTask = await prisma.tasks.findUnique({
            where: { task_id: taskId }
        });

        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await prisma.clientTasks.deleteMany({
            where: {
                task_id: taskId,
                client_id: clientId
            }
        });

        await prisma.tasks.delete({
            where: { task_id: taskId }
        });

        res.status(200).json({ message: 'Task deleted successfully with related data' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};