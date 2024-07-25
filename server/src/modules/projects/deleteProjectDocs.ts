import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteProjectDoc = async (req: Request, res: Response) => {
    const { doc_id } = req.params;

    try {
        const projectDoc = await prisma.projectDocs.findUnique({
            where: { project_doc_id: parseInt(doc_id, 10) }
        });

        if (!projectDoc) {
            return res.status(404).json({ error: 'Project documentation not found' });
        }

        const deletedDoc = await prisma.projectDocs.delete({
            where: { project_doc_id: projectDoc.project_doc_id }
        });

        const deletedLink = await prisma.projectLinks.delete({
            where: { link_id: projectDoc.link_id }
        });

        res.status(200).json({ deletedDoc, deletedLink });
    } catch (error) {
        console.error('Error deleting project documentation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
