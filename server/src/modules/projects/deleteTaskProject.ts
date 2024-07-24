import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const deleteTaskProject = async (req: Request, res: Response) => {
    const { task_id } = req.params;

    try {
        const projectTasks = await prisma.projectTasks.findMany({
            where: { task_id: parseInt(task_id, 10) },
            select: { task_project_id: true }
        });

        const taskProjectIds = projectTasks.map(tp => tp.task_project_id);

        await prisma.$transaction([
            prisma.taskAssignments.deleteMany({
                where: { 
                    task_project_id: {
                        in: taskProjectIds
                    }
                }
            }),
            prisma.projectTasks.deleteMany({
                where: { task_id: parseInt(task_id, 10) }
            }),
            prisma.tasks.delete({
                where: { task_id: parseInt(task_id, 10) }
            })
        ]);

        res.status(200).json({ message: 'Project task and related entries deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};