import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const deleteProjectMeeting = async (req: Request, res: Response) => {
    const { meeting_id } = req.params;

    try {

        const meetingExists = await prisma.meetings.findFirst({
            where: { meeting_id: parseInt(meeting_id) }
        });

        if (!meetingExists) {
            return res.status(404).json({ error: 'Project meeting not found' });
        }

        await prisma.$transaction([
            prisma.projectMeetings.deleteMany({
                where: { meeting_id: parseInt(meeting_id) }
            }),
            prisma.meetings.delete({
                where: { meeting_id: parseInt(meeting_id, 10) }
            })
        ]);

        res.status(200).json({ message: 'Project meeting and related entries deleted successfully' });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};