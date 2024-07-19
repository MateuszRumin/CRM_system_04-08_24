import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const updateModule = async (req: Request, res: Response) => {
    const { module_id } = req.params;
    const { name } = req.body;
    try {
        const dataToUpdate: any = {
            name
        };

        const updatedModule = await prisma.modules.update({
            where: { module_id: parseInt(module_id) },
            data: dataToUpdate
        });

        res.status(200).json(updatedModule);
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
