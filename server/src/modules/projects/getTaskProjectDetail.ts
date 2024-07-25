import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getTaskProjectDetails = async (req: Request, res: Response) => {
    const { task_id } = req.params;

    try {
        const taskDetails = await prisma.tasks.findUnique({
            where: { task_id: parseInt(task_id, 10) },
            include: {
                Status: true,
                ProjectTask: {
                    include: {
                        Project: {
                            include: {
                                Status: true
                            }
                        },
                        TaskAssignment: {
                            include: {
                                User: {
                                    select: {
                                        user_id: true,
                                        username: true,
                                        UserData: {
                                            select: {
                                                Position: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
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

        if (!taskDetails) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Eliminowanie duplikatów w odpowiedzi
        const projectTaskMap = new Map();
        taskDetails.ProjectTask.forEach((projectTask) => {
            const projectId = projectTask.project_id;
            if (!projectTaskMap.has(projectId)) {
                projectTaskMap.set(projectId, {
                    project_id: projectTask.Project.project_id,
                    name: projectTask.Project.name,
                    client_id: projectTask.Project.client_id,
                    status_id: projectTask.Project.status_id,
                    description: projectTask.Project.description,
                    created_at: projectTask.Project.created_at,
                    updated_at: projectTask.Project.updated_at,
                    Status: projectTask.Project.Status,
                    TaskAssignment: []
                });
            }

            projectTask.TaskAssignment.forEach((taskAssignment) => {
                projectTaskMap.get(projectId).TaskAssignment.push(taskAssignment);
            });
        });

        const response = {
            ...taskDetails,
            ProjectTask: Array.from(projectTaskMap.values())
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving task details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};