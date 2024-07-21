import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieNumber = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {
        //pobranie danych z req
        const initData = req.body
    

        

        

        const insertData = {
            block:true,
            month:initData.main.month || null,
            year:initData.main.year || null,
            invoice_number:initData.main.invoice_number || null,
        }
        
        
        
        // push danych do bazy danych
 
        
        const invoice = await prisma.Invoices.update({
            where:{
                invoice_id:initData.invoice_id
            },
            data:insertData
        })

        await prisma.InvoiceTypes.update({
            where:{
                invoice_type_id:invoice.invoice_type_id
            },
            data:{
                current_number_sequence:insertData.invoice_number++
            }
        })


        console.log('Invoice modify blocked:', invoice);
        next()

    }catch (error){
        console.error('Error adding invoice main data', error);

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
