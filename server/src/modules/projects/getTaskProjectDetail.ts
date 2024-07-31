import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getTaskProjectDetails = async (req: Request, res: Response) => {
    const { task_id } = req.params;

    try {
        const taskDetails = await prisma.tasks.findUnique({
            where: { task_id: parseInt(task_id, 10) },
            select: {
                task_id: true,
                predicted_time: true,
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

        // Tworzenie uproszczonej odpowiedzi bez eliminowania duplikatów
        const response = {
            task_id: taskDetails.task_id,
            predicted_time: taskDetails.predicted_time,
            Status: taskDetails.Status,
            ProjectTask: taskDetails.ProjectTask.map((projectTask) => ({
                project_id: projectTask.Project.project_id,
                name: projectTask.Project.name,
                Status: projectTask.Project.Status,
                TaskAssignment: projectTask.TaskAssignment.map((taskAssignment) => ({
                    user_id: taskAssignment.User.user_id,
                    username: taskAssignment.User.username,
                    // position: taskAssignment.User.UserData.Position.name
                }))
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving task details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
