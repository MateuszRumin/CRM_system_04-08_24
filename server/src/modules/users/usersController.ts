import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

exports.registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const { username, email, password, firstName, lastName, telNumber, contract, employedFrom, employedTo } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                UserData: {
                    create: {
                        first_name: firstName,
                        second_name: lastName,
                        employed_from: new Date(employedFrom),
                        employed_to: new Date(employedTo),
                        tel_number: telNumber,
                        concract: contract,
                    }
                }
            }
        });

        res.status(201).json(user);
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd rejestracji użytkownika',
            devmessage: `${error}`,
            data: null
        };
        res.status(500).json(response);
    }
};

exports.loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            const response: IResponse = {
                status: 'error',
                display: true,
                error: null,
                message: 'Nieprawidłowe dane logowania',
                devmessage: 'User not found',
                data: null
            };
            return res.status(401).json(response);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const response: IResponse = {
                status: 'error',
                display: true,
                error: null,
                message: 'Nieprawidłowe dane logowania',
                devmessage: 'Invalid password',
                data: null
            };
            return res.status(401).json(response);
        }

        const token = jwt.sign({ userId: user.user_id }, secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd logowania',
            devmessage: `${error}`,
            data: null
        };
        res.status(500).json(response);
    }
};

exports.getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd pobierania użytkowników',
            devmessage: `${error}`,
            data: null
        };
        res.status(500).json(response);
    }
};

exports.deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const { userId } = req.params;
        await prisma.users.delete({ where: { user_id: parseInt(userId, 10) } });
        res.status(204).end();
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd usuwania użytkownika',
            devmessage: `${error}`,
            data: null
        };
        res.status(500).json(response);
    }
};

exports.deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const { userId } = req.params;
        await prisma.users.delete({ where: { user_id: parseInt(userId, 10) } });
        res.status(204).end();
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd usuwania użytkownika',
            devmessage: `${error}`,
            data: null
        };
        res.status(500).json(response);
    }
};

exports.updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');
    try {
        const { userId } = req.params;
        const { username, email, password, firstName, lastName, telNumber, contract, employedFrom, employedTo } = req.body;

        const updateUserData: any = {};
        if (username) updateUserData.username = username;
        if (email) updateUserData.email = email;
        if (password) updateUserData.password = await bcrypt.hash(password, 10);

        const updateUser = await prisma.users.update({
            where: { user_id: parseInt(userId, 10) },
            data: updateUserData
        });

        const updateUserDataData: any = {};
        if (firstName) updateUserDataData.first_name = firstName;
        if (lastName) updateUserDataData.second_name = lastName;
        if (telNumber) updateUserDataData.tel_number = telNumber;
        if (contract) updateUserDataData.concract = contract;
        if (employedFrom) updateUserDataData.employed_from = new Date(employedFrom);
        if (employedTo) updateUserDataData.employed_to = new Date(employedTo);

        if (Object.keys(updateUserDataData).length > 0) {
            await prisma.userDatas.update({
                where: { user_id: parseInt(userId, 10) },
                data: updateUserDataData
            });
        }

        res.status(200).json({ message: 'Użytkownik zaktualizowany pomyślnie', updateUser });
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd aktualizacji użytkownika',
            devmessage: `${error}`,
            data: null
        };
        res.status(500).json(response);
    }
};