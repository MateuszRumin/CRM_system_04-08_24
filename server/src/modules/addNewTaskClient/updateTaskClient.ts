// src/controllers/updateTaskStatus.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const updateTaskStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status_id } = req.body;
    try {
        const updatedTask = await prisma.tasks.update({
            where: { task_id: parseInt(id) },
            data: {
                status_id: status_id,
            },
        });
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateClientTask = async (req: Request, res: Response) => {
    const { task_id } = req.params;
    const { status_id, user_id, task_name, task_text, deadline } = req.body;

    try {
        const id = parseInt(task_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task_id parameter' });
        }

        const existingTask = await prisma.tasks.findUnique({
            where: { task_id: id }
        });

        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await prisma.tasks.update({
            where: { task_id: id },
            data: {
                status_id,
                user_id,
                task_name,
                task_text,
                deadline
            }
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};