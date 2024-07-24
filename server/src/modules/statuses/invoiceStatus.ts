import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectInvoiceStatuses = async (req: Request, res: Response) => {

};