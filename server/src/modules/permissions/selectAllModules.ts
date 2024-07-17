import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllModules = async (req: Request, res: Response) => {
    try {
        const modules = await prisma.modules.findMany({
            // include: {
            //     Permission: true
            // }
        });
        res.status(200).json(modules);
    } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};