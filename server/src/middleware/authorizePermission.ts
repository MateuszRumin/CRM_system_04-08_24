import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authorizePermission = (moduleName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Zakładamy, że userId jest przechowywane w `req.user` 
            //po uwierzytelnieniu i zdekodowaniu tokena w authenticateToken i dodaniu userId do req
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Pobieranie ról użytkownika
            const userRoles = await prisma.userRoles.findMany({
                where: { user_id: userId },
                select: { role_id: true }
            });

            if (!userRoles.length) {
                return res.status(404).json({ error: 'User roles not found' });
            }

            const roleIds = userRoles.map(role => role.role_id);

            // Pobieranie modułu na podstawie nazwy
            const module = await prisma.modules.findUnique({
                where: { name: moduleName },
                select: { module_id: true }
            });

            if (!module) {
                return res.status(404).json({ error: 'Module not found' });
            }

            // Sprawdzanie uprawnień dla wszystkich ról użytkownika
            const permissions = await prisma.permissions.findMany({
                where: {
                    role_id: { in: roleIds },
                    module_id: module.module_id
                },
                select: { access: true }
            });

            const hasAccess = permissions.some(permission => permission.access);

            if (!hasAccess) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};