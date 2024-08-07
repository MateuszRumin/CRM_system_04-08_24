import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

exports.caculateInvProducts = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma');

    try {
        const products = req.body.products;
        
        let newProductsAmmount = {
            summary: {
                net_amount: 0,
                brutto_amount: 0,
                vat_amount: 0,
                note: req.body.summary.note
            }
        };

        // Pobranie ustawień faktury
        const settings = await prisma.InvoicePaymentSettings.findFirst({
            select: {
                advancement_rate: true,
                tax_rate: true,
                tax_type: true,
                default_vat_amount: true,
                company_id: true
            }
        });

        // Ustalenie stawki VAT
        const vatPercentage = settings.advancement_rate || settings.default_vat_amount;

        for (let product of products) {
            let vatAmount = (product.unit_price * vatPercentage) / 100;
            let bruttoAmount = product.unit_price + vatAmount;

            newProductsAmmount.summary.net_amount += product.unit_price * product.product_count;
            newProductsAmmount.summary.brutto_amount += bruttoAmount * product.product_count;
            newProductsAmmount.summary.vat_amount += vatAmount * product.product_count;

            // Dodanie produktu do bazy danych
            await prisma.InvoiceProducts.create({
                data: {
                    invoice_id: req.body.invoice_id,
                    project_id: product.project_id || null,
                    product_name: product.product_name || null,
                    unit_price: product.unit_price,
                    product_count: product.product_count,
                    prize: bruttoAmount,
                    tax: vatAmount
                }
            });
        }

        // Aktualizacja faktury na podstawie obliczeń
        await prisma.Invoices.update({
            where: { invoice_id: req.body.invoice_id },
            data: {
                prize_netto: newProductsAmmount.summary.net_amount,
                prize_brutto: newProductsAmmount.summary.brutto_amount,
                tax_ammount: newProductsAmmount.summary.vat_amount,
                comments: newProductsAmmount.summary.note
            }
        });

        // Przesłanie obliczeń jako odpowiedź
        res.json(newProductsAmmount);

    } catch (error) {
        console.error('Error calculating invoice products', error);

        const response = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd obliczania produktów faktury',
            devmessage: `${error}`,
            data: null
        };

        res.status(404).json(response);
    }
};