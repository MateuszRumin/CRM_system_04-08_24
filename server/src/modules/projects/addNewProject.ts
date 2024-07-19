import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// export const addNewProject = async (req: Request, res: Response) => {
//     const {name, client_id, status_id, description} = req.body;


//     try {
//         const newProject = await prisma.projects.create({
//             data: {
//                 name,
//                 client_id,
//                 status_id,
//                 description,
//                 ProjectAssignment: {
//                     create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })),
//                 },
//                 // UserRole: {
//                 //     create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })),
//                 // },
//             },
//             include: {
//                 UserRole: {
//                     include: {
//                         Role: true
//                     },
//                 },
//                 UserData: {
//                     include: {
//                         Position: true
//                     }
//                 }
//             },
//         });

//         res.status(201).json({ newUser });
//     }
// };