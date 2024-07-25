import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectProjectStatuses = async (req: Request, res: Response) => {
    try {
        const projectStatuses = await prisma.statuses.findMany({
            where: {
                status_type: 'Projekt'
            }
        });
        res.status(200).json(projectStatuses);
    } catch (error) {
        console.error('Error fetching project statuses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateProjectStatus = async (req: Request, res: Response) => {
    const { project_id, status_id } = req.params;

    try {
        const statusExists = await prisma.statuses.findUnique({
            where: { status_id: parseInt(status_id, 10) }
        });

        if (!statusExists) {
            return res.status(400).json({ error: 'Status not found' });
        }

        const updatedProject = await prisma.projects.update({
            where: { project_id: parseInt(project_id, 10) },
            data: { status_id: parseInt(status_id, 10) }
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};