import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
      // Fetch all invoice types
      const invoiceTypes = await prisma.invoiceTypes.findMany();

      // Fetch company settings
      const companySettings = await prisma.companySettings.findFirst();

      // Fetch invoice settings
      const invoiceSettings = await prisma.invoiceSettings.findFirst();

      // Fetch invoice payment settings
      const invoicePaymentSettings = await prisma.invoicePaymentSettings.findFirst();

      // Fetch invoice payment settings
      const invoiceMarkers = await prisma.markers.findMany();

      // Respond with all settings
      res.status(200).json({
          status: 'success',
          data: {
              invoiceTypes,
              companySettings,
              invoiceSettings,
              invoicePaymentSettings,
              invoiceMarkers
          },
      });
  } catch (error) {
      console.error('Error fetching settings', error);

      res.status(500).json({
          status: 'error',
          message: 'Error fetching settings',
          error: error,
      });
  }
};

