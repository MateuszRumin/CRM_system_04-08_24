// src/controllers/updateTaskStatus.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { task_id, status_name } = req.body;

        // Pobranie nowego statusu zadania
        const newStatus = await prisma.statuses.findFirst({
            select: {
                status_id: true,
            },
            where: {
                status_type: 'Zadanie',
                name: status_name,
            },
        });

        if (!newStatus) {
            const response: IResponse = {
                status: 'error',
                display: true,
                error: { message: `Nie znaleziono statusu o nazwie ${status_name}` },
                message: 'Błąd podczas aktualizacji statusu zadania',
                devmessage: `Nie znaleziono statusu o nazwie ${status_name}`,
                data: null,
            };
            return res.status(404).json(response);
        }

        // Aktualizacja zadania
        const updatedTask = await prisma.tasks.update({
            where: {
                task_id: task_id,
            },
            data: {
                status_id: newStatus.status_id,
            },
        });

        const response: IResponse = {
            status: 'info',
            display: true,
            error: null,
            message: 'Zaktualizowano status zadania',
            devmessage: `Aktualizacja statusu zadania o id ${task_id} zakończona sukcesem`,
            data: updatedTask,
        };

        res.status(200).json(response);
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd podczas aktualizacji statusu zadania',
            devmessage: `${error}`,
            data: null,
        };

        res.status(500).json(response);
    }
};