import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const selectAllRoles = async (req: Request, res: Response) => {
    try {
        const roles = await prisma.roles.findMany({
            // include: {
            //     Module: true,
            //     Role: true
            // }
        });
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addNewRole = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        // Sprawdzenie, czy nazwa roli już istnieje
        const existingRole = await prisma.roles.findUnique({
            where: { name },
        });

        if (existingRole) {
            return res.status(400).json({ error: 'Role already exists' });
        }

        const newRole = await prisma.roles.create({
            data: { name },
        });

        res.status(201).json({ newRole });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};