import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const addNewModule = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const newModule = await prisma.modules.create({
            data: {
                name
            },
        });

        res.status(201).json({ newModule });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};