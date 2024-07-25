import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();


export const updateTaskProject = async (req: Request, res: Response) => {
    const { task_id } = req.params;
    const { user_id, task_name, task_text, predicted_time, status_id, deadline, days_to_reminder_app, days_to_reminder_email, assignedUsers = [] } = req.body;

    try {
        const dataToUpdate: any = {};

        if (user_id) {
            dataToUpdate.user_id = user_id;
        }

        if (task_name) {
            dataToUpdate.task_name = task_name;
        }

        if (task_text) {
            dataToUpdate.task_text = task_text;
        }

        if (predicted_time) {
            dataToUpdate.predicted_time = predicted_time;
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

        if (deadline) {
            dataToUpdate.deadline = deadline;
        }

        if (days_to_reminder_app) {
            dataToUpdate.days_to_reminder_app = days_to_reminder_app;
        }

        if (days_to_reminder_email) {
            dataToUpdate.days_to_reminder_email = days_to_reminder_email;
        }

        const updatedTask = await prisma.tasks.update({
            where: { task_id: parseInt(task_id, 10) },
            data: dataToUpdate,
            include: {
                Status: true,
                ProjectTask: {
                    include: {
                        TaskAssignment: {
                            include: {
                                User: true
                            }
                        }
                    }
                }
            }
        });

        if(assignedUsers) {
            const projectTask = await prisma.projectTasks.findFirst({
                where: { task_id: parseInt(task_id, 10) },
            });

            if (!projectTask) {
                return res.status(404).json({ error: 'Project task not found' });
            }

            const task_project_id = projectTask.task_project_id;

            // Usuń wszystkich aktualnie przypisanych użytkowników do zadania
            await prisma.taskAssignments.deleteMany({
                where: {
                    task_project_id: {
                        in: updatedTask.ProjectTask.map(pt => pt.task_project_id)
                    }
                }
            });

            // Dodaj nowych użytkowników do zadania (jeśli są podani)
            if (assignedUsers.length > 0) {
                const usersExist = await prisma.users.findMany({
                    where: {
                        user_id: { in: assignedUsers }
                    }
                });

                if (usersExist.length !== assignedUsers.length) {
                    return res.status(404).json({ error: 'One or more users not found' });
                }

                for (const user_id of assignedUsers) {
                    await prisma.taskAssignments.create({
                        data: {
                            task_project_id,
                            user_id
                        }
                    });
                }
            }
        }

        const refreshedTask = await prisma.tasks.findUnique({
            where: { task_id: parseInt(task_id, 10) },
            select: {
                task_name: true,
                deadline: true,
                task_text: true,
                predicted_time:true,
                Status: true,
                ProjectTask: {
                    select: {
                        Project: {
                            select: {
                                name: true,
                                description: true,
                                Status: true
                            }
                        },
                        TaskAssignment: {
                            select: {
                                User: {
                                    select: {
                                        user_id: true,
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json(refreshedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};