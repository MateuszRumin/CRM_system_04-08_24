import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getTaskProjectDetails = async (req: Request, res: Response) => {
    const { task_id } = req.params;

    try {
        // Pobieranie szczegółów zadania z powiązanymi danymi
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

        // Zwracanie pełnych szczegółów zadania, w tym powiązanych danych
        res.status(200).json(taskDetails);
    } catch (error) {
        console.error('Error retrieving task details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};