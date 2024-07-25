import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getProjectAssignedUsers = async (req: Request, res: Response) => {
    const { project_id } = req.params;

    try {

        const projectExists = await prisma.projects.findFirst({
            where: { project_id: parseInt(project_id) }
        });

        if (!projectExists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projectAssignments = await prisma.projects.findMany({
            where: { project_id: parseInt(project_id, 10) },
            include: {
                ProjectAssignment: {
                    include: {
                        User: {
                            select: {
                                user_id:true,
                                username:true,
                                UserData: {
                                    select: {
                                        first_name:true,
                                        second_name:true,
                                        Position: {
                                            select: {
                                                name:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Wyodrębnienie unikalnych użytkowników
        const assignedUsers = projectAssignments.flatMap(pa => pa.ProjectAssignment).map(ta => ta.User);

        if (assignedUsers.length === 0) {
            return res.status(404).json({ error: 'No users assigned for this project yet' });
        }

        res.status(200).json(assignedUsers);
    } catch (error) {
        console.error('Error fetching project assigned users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};