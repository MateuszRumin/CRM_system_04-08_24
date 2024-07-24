import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addFigmaLink = async (req: Request, res: Response) => {
    const { project_id, link, name } = req.body;

    try {
        const newLink = await prisma.projectLinks.create({
            data: {
                project_id,
                link_type: 'Figma',
                link,
                name
            }
        });
        res.status(201).json(newLink);
    } catch (error) {
        console.error('Error adding Figma link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};