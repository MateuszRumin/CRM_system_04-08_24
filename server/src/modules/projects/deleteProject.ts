import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const deleteProject = async (req: Request, res: Response) => {
    const { project_id } = req.params;

    try {

        const projectExists = await prisma.projects.findFirst({
            where: { project_id: parseInt(project_id) }
        });

        if (!projectExists) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const taskProjects = await prisma.projectTasks.findMany({
            where: { project_id: parseInt(project_id, 10) },
            select: { task_project_id: true }
        });

        const taskProjectIds = taskProjects.map(tp => tp.task_project_id);

        await prisma.$transaction([
            prisma.taskAssignments.deleteMany({
                where: { 
                    task_project_id: {
                        in: taskProjectIds
                    }
                }
            }),
            prisma.projectTasks.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.projectAssignments.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.projectDetails.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.contracts.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.projectLinks.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.projectMeetings.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.projectDocs.deleteMany({
                where: { project_id: parseInt(project_id, 10) }
            }),
            prisma.projects.delete({
                where: { project_id: parseInt(project_id, 10) }
            })
        ]);

        res.status(200).json({ message: 'Project and related entries deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};