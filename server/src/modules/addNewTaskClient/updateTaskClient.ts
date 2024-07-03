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