import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

interface JwtPayload {
    userId: number;
    role: string;
    username: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        // Verify the token
        const user = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = user;

        // Check if session is active and not expired
        const session = await prisma.workSessions.findFirst({
            where: { token },
        });

        if (!session || !session.active || new Date() > session.expires_at) {
            return res.sendStatus(403); // Forbidden, session has expired or is inactive
        }

        // Optionally, refresh session expiration
        // await prisma.workSessions.update({
        //     where: { token },
        //     data: { expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000) }, // extend by 8 hours
        // });

        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

export const authorizeRole = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.sendStatus(403)
		}
		next()
	}
}
