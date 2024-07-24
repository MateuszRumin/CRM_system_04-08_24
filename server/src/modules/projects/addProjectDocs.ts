import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addProjectDoc = async (req: Request, res: Response) => {
    const { project_id, file_name, doc_description, link } = req.body;

    try {
        const newLink = await prisma.projectLinks.create({
            data: {
                project_id,
                link_type: 'Documentation',
                link,
                name: file_name
            }
        });

        const newDoc = await prisma.projectDocs.create({
            data: {
                project_id,
                file_name,
                doc_description,
                link_id: newLink.link_id
            }
        });

        res.status(201).json({ newDoc, newLink });
    } catch (error) {
        console.error('Error adding project doc:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};