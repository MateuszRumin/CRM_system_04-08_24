import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
//models: tasks, taskassignments, projecttasks

export const addNewTaskProject = async (req: Request, res: Response) => {
    try {
        const { project_id, user_id, task_name, task_text, predicted_time, status_id, deadline, days_to_reminder_app, days_to_reminder_email, assignedUsers = [] } = req.body;

        const nameExists = await prisma.tasks.findFirst({
            where: { task_name }
        });

        if (nameExists) {
            return res.status(400).json({ error: 'Task name already exists' });
        }

        const projectExists = await prisma.projects.findFirst({
            where: { project_id: parseInt(project_id) }
        });

        if (!projectExists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Sprawdzenie czy użytkownicy istnieją
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

        // Ustawienie statusu zadania
        let finalTaskStatusId = status_id;

        if (status_id) {
            const statusExist = await prisma.statuses.findUnique({
                where: { status_id }
            });

            if (!statusExist) {
                return res.status(404).json({ error: 'Status ID not found' });
            }
        } else {
            const defaultStatus = await prisma.statuses.findFirst({
                where: {
                    status_type: 'Zadanie',
                    default: true
                },
                select: { status_id: true, name: true }
            });

            if (!defaultStatus) {
                return res.status(404).json({ error: 'Default status not found' });
            }

            finalTaskStatusId = defaultStatus.status_id;
        }

        // Tworzenie zadania i przypisanie go do projektu w jednym zapytaniu
        const task = await prisma.tasks.create({
            data: {
                user_id,
                task_name,
                task_text,
                predicted_time,
                status_id: finalTaskStatusId,
                deadline,
                days_to_reminder_app,
                days_to_reminder_email,
                ProjectTask: {
                    create: {
                        project_id: parseInt(project_id, 10)
                    }
                }
            },
            include: {
                Status: true,
                ProjectTask: true
            }
        });

        // Przypisanie użytkowników do zadania (jeśli są podani)
        if (assignedUsers.length > 0) {
            for (const user_id of assignedUsers) {
                const existingAssignment = await prisma.taskAssignments.findFirst({
                    where: {
                        task_project_id: task.ProjectTask[0].task_project_id,
                        user_id
                    }
                });

                if (!existingAssignment) {
                    await prisma.taskAssignments.create({
                        data: {
                            task_project_id: task.ProjectTask[0].task_project_id,
                            user_id
                        }
                    });
                } else {
                    return res.status(404).json({ error: 'User already assigned to project task' });
                }
            }
        }

        // Wypisanie przypisania użytkowników do taska
        const updatedTask = await prisma.tasks.findUnique({
            where: { task_id: task.task_id },
            select: {
                task_id: true,
                task_name: true,
                deadline: true,
                task_text: true,
                Status: true,
                ProjectTask: {
                    select: {
                        Project: {
                            select: {
                                name: true,
                                description: true,
                                Status: true,
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

        return res.status(201).json(updatedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};