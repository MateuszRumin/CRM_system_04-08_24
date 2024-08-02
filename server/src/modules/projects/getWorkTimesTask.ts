import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUserTimeSpentOnDay = async (req: Request, res: Response) => {
    try {
        const { user_id, day } = req.body;

        if (!user_id || !day) {
            return res.status(400).json({ error: 'user_id and day are required' });
        }

        const date = new Date(day as string);
        const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

        const timeSpent = await prisma.taskTimes.aggregate({
            _sum: {
                time_spent: true,
            },
            where: {
                user_id: Number(user_id),
                day: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        return res.status(200).json({ time_spent: timeSpent._sum.time_spent || 0 });
    } catch (error) {
        console.error('Error fetching time spent on day:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserTimeSpentInMonth = async (req: Request, res: Response) => {
    try {
        const { user_id, month } = req.body;

        if (!user_id || !month) {
            return res.status(400).json({ error: 'user_id and month are required' });
        }

        const date = new Date(month as string);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

        const timeSpent = await prisma.taskTimes.aggregate({
            _sum: {
                time_spent: true,
            },
            where: {
                user_id: Number(user_id),
                day: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        return res.status(200).json({ time_spent: timeSpent._sum.time_spent || 0 });
    } catch (error) {
        console.error('Error fetching time spent in month:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//
export const getTotalTimeProjectInMonth = async (req: Request, res: Response) => {
    try {
        const { project_id } = req.params;
        const { month } = req.body;  // Miesiąc w formacie YYYY-MM przesyłany w ciele żądania

        if (!project_id || !month) {
            return res.status(400).json({ error: 'project_id and month are required' });
        }

        // Sprawdzanie poprawności formatu miesiąca
        if (!/^(\d{4}-\d{2})$/.test(month)) {
            return res.status(400).json({ error: 'Month must be in YYYY-MM format' });
        }

        const year = parseInt(month.split('-')[0], 10);
        const monthIndex = parseInt(month.split('-')[1], 10) - 1; // Miesiące w JavaScript są zerobazowe

        // Ustawienie zakresu dat
        const startOfMonth = new Date(year, monthIndex, 1);
        const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999); // Ostatni dzień miesiąca o 23:59:59.999

        // Pobranie tasków związanych z projektem
        const tasksForProject = await prisma.projectTasks.findMany({
            where: {
                project_id: Number(project_id),
            },
            select: {
                task_id: true,
            },
        });

        const taskIds = tasksForProject.map(task => task.task_id);

        // Agregowanie czasu spędzonego na zadaniach w danym miesiącu
        const timeSpent = await prisma.taskTimes.aggregate({
            _sum: {
                time_spent: true,
            },
            where: {
                task_id: {
                    in: taskIds,
                },
                day: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        return res.status(200).json({ time_spent: timeSpent._sum.time_spent || 0 });
    } catch (error) {
        console.error('Error fetching total time on project in month:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//
export const getTotalTimeProjectInDay = async (req: Request, res: Response) => {
    try {
        const { project_id } = req.params;
        const { day } = req.body;

        if (!project_id || !day) {
            return res.status(400).json({ error: 'project_id and day are required' });
        }

        const date = new Date(day as string);
        const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

        // Pobranie tasków związanych z projektem
        const tasksForProject = await prisma.projectTasks.findMany({
            where: {
                project_id: Number(project_id),
            },
            select: {
                task_id: true,
            },
        });

        const taskIds = tasksForProject.map(task => task.task_id);

        const timeSpent = await prisma.taskTimes.aggregate({
            _sum: {
                time_spent: true,
            },
            where: {
                task_id: {
                    in: taskIds,
                },
                day: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        return res.status(200).json({ time_spent: timeSpent._sum.time_spent || 0 });
    } catch (error) {
        console.error('Error fetching total time on project in day:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};