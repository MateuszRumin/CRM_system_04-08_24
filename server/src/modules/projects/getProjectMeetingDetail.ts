import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getProjectMeetingDetail = async ( req : Request, res: Response ) => {
    try {
        const { meeting_id } = req.params;
        
        const meetingExists = await prisma.meetings.findFirst({
            where: { meeting_id: parseInt(meeting_id) }
        });

        if (!meetingExists) {
            return res.status(404).json({ error: 'Project meeting not found' });
        }

        const meeting = await prisma.meetings.findUnique({
            where: { meeting_id: parseInt(meeting_id, 10) },
            select: {
                meeting_id: true,
                date: true,
                time_spent: true,
                meeting_description: true,
                meeting_outcomes: true,
                meeting_link: true,
                ProjectMeeting: {
                    select: {
                        Project: true,
                    }
                }
            },
        });

        res.status(200).json(meeting);
    } catch (error) {
        console.error("Error fetching project meeting details:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};