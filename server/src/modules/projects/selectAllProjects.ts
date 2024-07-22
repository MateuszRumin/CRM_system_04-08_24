import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.projects.findMany({
            include: {
                ProjectDetail: true,
                Status: true
            }
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllProjectsWithoutUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.user_id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user_id parameter' });
        }

        const projects = await prisma.projects.findMany({
            where: {
                ProjectAssignment: {
                    none: {
                        user_id: userId
                    }
                }
            },
            include: {
                ProjectDetail: true
            }
        });

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No available projects to assign to this user' });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllProjectsWithUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.user_id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user_id parameter' });
        }

        const projects = await prisma.projects.findMany({
            where: {
                ProjectAssignment: {
                    some: {
                        user_id: userId
                    }
                }
            },
            include: {
                ProjectDetail: true
            }
        });

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects assigned to this user' });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};