import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClientCheck = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {
        
        const productsData = req.body.products

        for (let product of productsData){

            const addedProduct =
            {
                project_id:product.project_id || null,
                invoice_id:req.body.invoice_id,  
                product_name:product.product_name || null, 
                unit_price:product.unit_price, 
                product_count:product.product_count, 
                prize:product.prize,
                tax:product.tax 
            }

            await prisma.InvoiceProducts.create({
                data:{addedProduct}
            })


        }


        const response: IResponse = {
            status: 'info',
            display: true,
            error: null,
            message: 'Dodano nową fakturę',
            devmessage: `Fv number-not-generated/nie wystawion/zapisano`,
            data: null
        };   

        res.status(201).json(response)
    }catch (error){
        console.error('Error adding invoice products', error);

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania nowej faktury',
            devmessage: `${error}`,
            data: null
        };   


        res.status(404).json(response)
    }



    



}