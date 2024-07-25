import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const addClientProjectMeeting = async ( req : Request, res: Response ) => {
    try {
        const { date, time_spent, meeting_description, meeting_outcomes, meeting_link, projectMeetings } = req.body;

        const project_id = projectMeetings?.project_id;

        const projectExists = await prisma.projects.findUnique({
            where: { project_id: parseInt(project_id) },
            include: { Client: true }
        });

        if (!projectExists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const meeting = await prisma.meetings.create({
            data: {
                date,
                time_spent,
                meeting_description,
                meeting_outcomes,
                meeting_link,
                ProjectMeeting: {
                    create: {
                        project_id: project_id,
                    },
                },
            },
            include: {
                ProjectMeeting: {
                    include: {
                        Project: {
                            select: {
                                project_id:true,
                                name:true,
                                Client: {
                                    select: {
                                        first_name: true,
                                        second_name: true,
                                        company_name:true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json(meeting);

    } catch (error) {
        console.error('Error adding new project meeting', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};