import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteLink = async (req: Request, res: Response) => {
    const { link_id } = req.params;

    try {
        const deletedLink = await prisma.projectLinks.delete({
            where: { link_id: parseInt(link_id, 10) }
        });
        res.status(200).json(deletedLink);
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
