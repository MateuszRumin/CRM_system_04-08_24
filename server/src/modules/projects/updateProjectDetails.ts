import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const updateProjectById = async (req: Request, res: Response) => {
    const { project_id } = req.params;
    const { name, client_id, status_id, description, projectDetails, assignedUsers = [] } = req.body;

    try {
        const dataToUpdate: any = {};

        if (name) {
            dataToUpdate.name = name;
        }

        if (client_id) {
            const clientExists = await prisma.clients.findUnique({
                where: { client_id },
            });

            if (!clientExists) {
                return res.status(400).json({ error: 'Client not found' });
            }

            dataToUpdate.client_id = client_id;
        }

        if (status_id) {
            const statusExists = await prisma.statuses.findUnique({
                where: { status_id },
            });

            if (!statusExists) {
                return res.status(400).json({ error: 'Status not found' });
            }

            dataToUpdate.status_id = status_id;
        }

        if (description) {
            dataToUpdate.description = description;
        }

        // Aktualizacja szczegółów projektu
        if (projectDetails) {
            const existingProjectDetail = await prisma.projectDetails.findFirst({
                where: { project_id: parseInt(project_id, 10) },
            });

            if (existingProjectDetail) {
                dataToUpdate.ProjectDetail = {
                    update: {
                        where: { project_detail_id: existingProjectDetail.project_detail_id },
                        data: {
                            ...projectDetails
                        }
                    }
                };
            } else {
                dataToUpdate.ProjectDetail = {
                    create: {
                        project_id: parseInt(project_id, 10),
                        ...projectDetails
                    }
                };
            }
        }

        // Aktualizacja przypisań projektu
        if (assignedUsers) {
            const userChecks = await Promise.all(assignedUsers.map(async (user_id: number) => {
                const userExists = await prisma.users.findUnique({
                    where: { user_id },
                });
                return userExists !== null;
            }));

            if (userChecks.includes(false)) {
                return res.status(400).json({ error: 'One or more users do not exist' });
            }

            dataToUpdate.ProjectAssignment = {
                deleteMany: { project_id: parseInt(project_id, 10) },
                create: assignedUsers.map((user_id: number) => ({
                    project_id: parseInt(project_id, 10),
                    user_id,
                }))
            };
        }
        
        const updatedProject = await prisma.projects.update({
            where: { project_id: parseInt(project_id, 10) },
            data: dataToUpdate,
            include: {
                ProjectDetail: true,
                ProjectAssignment: true,
            },
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};