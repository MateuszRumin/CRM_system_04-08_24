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

        let invoiceId = req.body.invoice_id;

        if (!invoiceId) {
            // Create a new invoice if no invoice_id is provided
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript

            // Retrieve invoice type from the request
            const invoiceTypeId = req.body.main.invoice_type_id;

            // Retrieve invoice type
            const invoiceType = await prisma.invoiceTypes.findUnique({
                where: { invoice_type_id: invoiceTypeId },
            });

            if (!invoiceType) {
                throw new Error('Invoice type not found');
            }

            // Retrieve current marker
            const marker = await prisma.markers.findUnique({
                where: { marker_id: invoiceType.marker_id },
            });

            if (!marker) {
                throw new Error('Marker not found');
            }

            // Check if month has changed
            if (currentMonth !== marker.current_month_sequence) {
                // Reset the invoice number if the month has changed
                await prisma.markers.update({
                    where: { marker_id: marker.marker_id },
                    data: {
                        current_month_sequence: currentMonth,
                        current_year_sequence: currentYear,
                        current_number_sequence: 1, // Reset invoice number
                    },
                });
            } else {
                // Increment the invoice number
                await prisma.markers.update({
                    where: { marker_id: marker.marker_id },
                    data: {
                        current_number_sequence: marker.current_number_sequence + 1,
                    },
                });
            }

            // Retrieve the updated marker
            const updatedMarker = await prisma.markers.findUnique({
                where: { marker_id: invoiceType.marker_id },
            });

            if (!updatedMarker) {
                throw new Error('Updated marker not found');
            }

            // Create a new invoice
            const invoice = await prisma.invoices.create({
                data: {
                    year: currentYear,
                    month: currentMonth,
                    invoice_number: `${currentYear}/${currentMonth}/${updatedMarker.current_number_sequence}`,
                    status_id: req.body.main.status_id,
                    invoice_type_id: invoiceTypeId,
                    client_id: req.body.client.client_id,
                    issue_date: new Date(),
                    due_date: req.body.main.due_date, // Adjust as necessary
                    prize_netto: req.body.summary.prize_netto,
                    prize_brutto: req.body.summary.prize_brutto,
                    tax_ammount: req.body.summary.tax_ammount,
                    comments: req.body.summary.comments,
                },
            });

            invoiceId = invoice.invoice_id // Set invoiceId to the newly created invoice ID
        }

        // Add products to the invoice
        const createProductsPromises = productsData.map(product =>
            prisma.invoiceProducts.create({
                data: {
                    project_id: product.project_id || null,
                    invoice_id: invoiceId, // Ensure we are using the correct invoiceId
                    product_name: product.product_name || null,
                    unit_price: product.unit_price,
                    product_count: product.product_count,
                    prize: product.prize,
                    tax: product.tax
                }
            })
        );

        await Promise.all(createProductsPromises);

        // Response after all products have been added
        const response = {
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

        const response = {
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