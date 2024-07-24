import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const addNewProject = async (req: Request, res: Response) => {
    try {
        const { name, client_id, description, status_id, projectDetails, assignedUsers = [] } = req.body;

        // Sprawdzenie wymaganych pól
        // if (!name || !client_id || !description || !projectDetails) {
        //     return res.status(400).json({ error: 'Missing required fields' });
        // }
        
        const clientExists = await prisma.clients.findUnique({
            where: { client_id }
        });

        if (!clientExists) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const nameExists = await prisma.projects.findFirst({
            where: { name }
        });

        if (nameExists) {
            return res.status(400).json({ error: 'Project name already exists' });
        }

        if (assignedUsers.length > 0) {
            const usersExist = await prisma.users.findMany({
                where: {
                    user_id: { in: assignedUsers }
                }
            });

            if (usersExist.length !== assignedUsers.length) {
                return res.status(404).json({ error: 'One or more users not found' });
            }
        }

        // Ustawienie statusu projektu
        let finalStatusId = status_id;

        if (status_id) {
            const statusExist = await prisma.statuses.findUnique({
                where: {
                    status_id: status_id
                }
            });

            if (!statusExist) {
                return res.status(404).json({ error: 'Status ID not found' });
            }
        } else {
            const defaultStatus = await prisma.statuses.findFirst({
                where: {
                    status_type: 'Projekt',
                    default: true
                },
                select: {
                    status_id: true,
                    name: true
                }
            });

            if (!defaultStatus) {
                return res.status(404).json({ error: 'Default status not found' });
            }

            finalStatusId = defaultStatus.status_id;
        }

        // Tworzenie projektu
        const project = await prisma.projects.create({
            data: {
                name,
                client_id,
                status_id: finalStatusId,
                description,
                ProjectDetail: {
                    create: {
                        ...projectDetails
                    }
                },
                ProjectAssignment: assignedUsers.length > 0 ? {
                    create: assignedUsers.map((user_id: number) => ({ user_id }))
                } : undefined
            },
            include: {
                Status: true,
                ProjectDetail: true,
                ProjectAssignment: {
                    include: {
                        User: true
                    }
                },
                ProjectLink:true
            }
        });

        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};