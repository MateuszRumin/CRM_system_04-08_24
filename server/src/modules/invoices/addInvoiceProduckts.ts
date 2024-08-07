import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvoiceProducts = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');

    try {
        const productsData = req.body.products;

        // Ensure productsData is an array
        if (!Array.isArray(productsData)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid products data format',
                data: null
            });
        }

        // Loop through each product and create it in the database
        for (let product of productsData) {
            await prisma.InvoiceProducts.create({
                data: {
                    project_id: product.project_id || null,
                    invoice_id: req.body.invoice_id,
                    product_name: product.product_name || null,
                    unit_price: product.unit_price,
                    product_count: product.product_count,
                    prize: product.prize,
                    tax: product.tax
                }
            });
        }

        // Response after all products have been added
        const response: IResponse = {
            status: 'success',
            display: true,
            error: null,
            message: 'Produkty zostały dodane do faktury',
            devmessage: 'Invoice products added successfully',
            data: null
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error adding invoice products', error);

        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd dodawania produktów do faktury',
            devmessage: `${error}`,
            data: null
        };

        res.status(500).json(response);
    }
};