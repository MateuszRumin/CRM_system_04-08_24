import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const updateProjectMeetingDetail = async (req: Request, res: Response) => {

    const { meeting_id } = req.params;
    const { date, time_spent, meeting_description, meeting_outcomes, meeting_link } = req.body;

    try {
        const dataToUpdate: any = {};
        
        if(date) {
            dataToUpdate.date=date;
        }

        if(time_spent) {
            dataToUpdate.time_spent=time_spent;
        }

        if(meeting_description) {
            dataToUpdate.meeting_description=meeting_description;
        }

        if(meeting_outcomes) {
            dataToUpdate.meeting_outcomes=meeting_outcomes;
        }

        if(meeting_link) {
            dataToUpdate.meeting_link=meeting_link;
        }

        const updatedMeeting = await prisma.meetings.update({
            where: { meeting_id: parseInt(meeting_id, 10) },
            data: dataToUpdate
        });

        res.status(200).json(updatedMeeting);
    } catch (error) {
        console.error('Error updating meeting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};