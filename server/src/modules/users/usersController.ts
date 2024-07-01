import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Funkcja pomocnicza do tworzenia JWT
const createToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({
            include: {
                UserData: true,
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
                Client: true,
                Task: true,
                Note: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(id) },
            include: {
                UserData: true,
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
                Client: true,
                Task: true,
                Note: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password, userData, userRoles } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                UserData: {
                    create: userData,
                },
                UserRole: {
                    create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })),
                },
            },
            include: {
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
            },
        });

        const userRole = newUser.UserRole[0].Role.name;
        const token = createToken(newUser.user_id, userRole);

        res.status(201).json({ newUser, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, password, userData, userRoles } = req.body;
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updatedUser = await prisma.users.update({
            where: { user_id: parseInt(id) },
            data: {
                username,
                email,
                password: hashedPassword,
                UserData: {
                    update: userData,
                },
                UserRole: {
                    deleteMany: { user_id: parseInt(id) }, // Usuń istniejące role użytkownika
                    create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })), // Dodaj nowe role
                },
            },
            include: {
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.users.delete({
            where: { user_id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userRole = user.UserRole[0].Role.name;
        const token = createToken(user.user_id, userRole);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};