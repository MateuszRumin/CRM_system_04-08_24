import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addRepositoryLink = async (req: Request, res: Response) => {
    const { project_id, link, name } = req.body;

    try {
        const newLink = await prisma.projectLinks.create({
            data: {
                project_id,
                link_type: 'Repository',
                link,
                name
            }
        });
        res.status(201).json(newLink);
    } catch (error) {
        console.error('Error adding repository link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
