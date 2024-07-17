import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const addNewPermission = async (req: Request, res: Response) => {
    const {module_id, role_id, access } = req.body;

    // Sprawdzenie, czy moduł/rola istnieje
    const moduleExists = await prisma.modules.findUnique({
        where: { module_id: module_id }
    });

    if (!moduleExists) {
        return res.status(404).json({ error: 'Module not found' });
    }

    // Sprawdzenie, czy moduł/rola istnieje
    const roleExists = await prisma.roles.findUnique({
        where: { role_id: role_id }
    });

    if (!roleExists) {
        return res.status(404).json({ error: 'Role not found' });
    }

    try {
        const newPermission = await prisma.permissions.create({
            data: {
                module_id,
                role_id,
                access
            },
            include: {
                Module: true,
                Role: true
            }
        });

        res.status(201).json({newPermission});
    } catch (error) {
        console.error(`Error adding permission for role id ${role_id} on module id ${module_id}, access: ${access}`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const changePermission = async (req: Request, res: Response) => {
    const { permission_id } = req.params;
    const { module_id, role_id, access } = req.body; //wystarczy samo access

    // Sprawdzenie, czy uprawnienie istnieje
    const permissionExists = await prisma.permissions.findUnique({
        where: { permission_id: parseInt(permission_id) }
    });

    if (!permissionExists) {
        return res.status(404).json({ error: 'Permission not found' });
    }

    try {
        const dataToUpdate: any = {
            module_id,
            role_id,
            access
        };

        const updatedPermission = await prisma.permissions.update({
            where: { permission_id: parseInt(permission_id) },
            data: dataToUpdate,
            include: {
                Module: true,
                Role: true
            }
        });

        res.status(200).json(updatedPermission);
    } catch (error) {
        console.error(`Error updating permission for role id ${role_id} on module id ${module_id}, access: ${access}`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};