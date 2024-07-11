import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Funkcja pomocnicza do tworzenia JWT
const createToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '10h' });
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({
            include: {
                UserData: true,
                UserRole: {
                    include: {
                        Role: true
                    }
                }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
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
        console.error('Error fetching user by ID:', error);
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
        // const token = createToken(newUser.user_id, userRole);

        res.status(201).json({ newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, password, userData, userRoles } = req.body;
    try {
        const dataToUpdate: any = {
            username,
            email,
            UserData: {
                update: userData,
            },
            UserRole: {
                deleteMany: { user_id: parseInt(id) }, // Usuń istniejące role użytkownika
                create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })),
            },
        };

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.users.update({
            where: { user_id: parseInt(id) },
            data: dataToUpdate,
            include: {
                UserData: true,
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const userId = parseInt(id);

        // Sprawdzenie, czy użytkownik istnieje
        const userExists = await prisma.users.findUnique({
            where: { user_id: userId }
        });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Usuń wszystkie powiązane dane z innych modeli
        await prisma.$transaction([
            prisma.userDatas.deleteMany({
                where: { user_id: userId }
            }),
            prisma.userRoles.deleteMany({
                where: { user_id: userId }
            }),
            prisma.clients.deleteMany({
                where: { user_id: userId }
            }),
            prisma.tasks.deleteMany({
                where: { user_id: userId }
            }),
            prisma.notes.deleteMany({
                where: { user_id: userId }
            }),
            // Usuń użytkownika
            prisma.users.delete({
                where: { user_id: userId }
            })
        ]);

        res.status(200).json({ message: 'User and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Sprawdzamy czy username jest dostarczony,
        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { username },
                ]
            },
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

        // Sprawdzamy poprawność hasła
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Pobieramy rolę użytkownika
        const userRole = user.UserRole[0].Role.name;
        // Tworzymy token
        const token = createToken(user.user_id, userRole);

        // Zwracamy token
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};