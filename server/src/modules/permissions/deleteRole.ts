import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const deleteRole = async (req: Request, res: Response) => {
    const { role_id } = req.params;
    try {
        const roleId = parseInt(role_id);
        // Sprawdzenie, czy rola istnieje
        const roleExists = await prisma.roles.findUnique({
            where: { role_id: roleId }
        });

        if (!roleExists) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Usuń wszystkie powiązane dane z innych modeli
        await prisma.$transaction([
            prisma.permissions.deleteMany({
                where: { role_id: roleId }
            }),
            prisma.userRoles.deleteMany({
                where: { role_id: roleId }
            }),
            prisma.roles.deleteMany({
                where: { role_id: roleId }
            }),
            // inne tabele
        ]);

        res.status(200).json({ message: `Role id ${roleId} and related data deleted successfully` });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};