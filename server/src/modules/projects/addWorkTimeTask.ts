import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const addWorkTimeTask = async (req: Request, res: Response) => {
    try {
        const {user_id, task_id, time_spent, day, comments } = req.body;

        const newTaskTime = await prisma.taskTimes.create({
            data: {
                user_id,
                task_id,
                time_spent,
                day,
                comments
            }
        });

        return res.status(201).json(newTaskTime);
    }   catch (error) {
        console.error('Error adding new task time:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};