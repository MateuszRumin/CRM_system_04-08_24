import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const selectAllUsersWithoutProject = async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.users.findMany({
            select: {
                user_id:true,
                username:true,
                UserData: {
                    select: {
                        first_name: true,
                        second_name: true,
                        Position: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        const usersWithProjects = await prisma.projectAssignments.findMany({
            select: {
                user_id: true
            }
        });

        const assignedUserIds = new Set(usersWithProjects.map(ua => ua.user_id));

        // Filtracja użytkowników bez projektów
        const usersWithoutProjects = allUsers.filter(user => !assignedUserIds.has(user.user_id));
        
        if (usersWithoutProjects.length === 0) {
            return res.status(404).json({ message: 'No users without projects' });
        }

        res.status(200).json(usersWithoutProjects);
    } catch (error) {
        console.error('Error fetching users without projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};