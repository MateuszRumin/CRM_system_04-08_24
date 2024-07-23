import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const deleteModule = async (req: Request, res: Response) => {
    const { module_id } = req.params;
    try {
        const moduleId = parseInt(module_id);
        // Sprawdzenie, czy moduł istnieje
        const moduleExists = await prisma.modules.findUnique({
            where: { module_id: moduleId }
        });

        if (!moduleExists) {
            return res.status(404).json({ error: 'Module not found' });
        }

        // Usuń wszystkie powiązane dane z innych modeli
        await prisma.$transaction([
            prisma.permissions.deleteMany({
                where: { module_id: moduleId }
            }),
            prisma.modules.deleteMany({
                where: { module_id: moduleId }
            }),
            // inne tabele
        ]);

        res.status(200).json({ message: `Module id ${moduleId} and related data deleted successfully` });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};