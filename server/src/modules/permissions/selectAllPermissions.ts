import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await prisma.permissions.findMany({
            include: {
                Module: true,
                Role: true
            }
        });
        res.status(200).json(permissions);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};