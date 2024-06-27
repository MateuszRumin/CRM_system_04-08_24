import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

exports.authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing!' });
    }
    try {
        const decoded: any = jwt.verify(token, secret);
        // req.user = decoded;
        req.body.user_id = decoded.userId;  // Dodane przypisanie user_id do req.body
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};