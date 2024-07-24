import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectAllUsersWithProjects = async (req: Request, res: Response) => {
    try {
        const usersWithProjects = await prisma.users.findMany({
            select: {
                user_id: true,
                username: true,
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
                },
                ProjectAssignment: {
                    include: {
                        Project: {
                            select: {
                                name:true,
                            }
                        }
                    }
                }
            }
        });

        // Filter users who have at least one project assigned and add project count
        const assignedUsers = usersWithProjects
            .filter(user => user.ProjectAssignment.length > 0)
            .map(user => ({
                user_id: user.user_id,
                username: user.username,
                first_name: user.UserData.length > 0 ? user.UserData[0].first_name : null,
                second_name: user.UserData.length > 0 ? user.UserData[0].second_name : null,
                position: user.UserData.length > 0 ? user.UserData[0].Position?.name : null,
                project_count: user.ProjectAssignment.length //ilosc projektow uzytkownika
            }));

        if (assignedUsers.length === 0) {
            return res.status(404).json({ message: 'No users assigned to any projects' });
        }

        res.status(200).json(assignedUsers);
    } catch (error) {
        console.error('Error fetching users with projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
