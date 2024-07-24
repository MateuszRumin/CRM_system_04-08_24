import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const updateRole = async (req: Request, res: Response) => {
    const { role_id } = req.params;
    const { name } = req.body;
    try {
        const dataToUpdate: any = {
            name
        };

        const updatedRole = await prisma.roles.update({
            where: { role_id: parseInt(role_id) },
            data: dataToUpdate
        });

        res.status(200).json(updatedRole);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
