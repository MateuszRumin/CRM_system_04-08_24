import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectTaskStatuses = async (req: Request, res: Response) => {

};