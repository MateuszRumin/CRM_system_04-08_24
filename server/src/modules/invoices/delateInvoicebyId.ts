import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {
        //dodać obsługę zblokowanyh/wystawionych
       const fvId = req.body.invoice_id

       await prisma.InvoiceProducts.delate({
        where:{
            invoice_id:fvId
        }
       })
       
       await prisma.Invoices.delate({
        where:{
            invoice_id:fvId
        }
       })
    
       const response: IResponse = {
        status: 'success',
        display: true,
        error: null,
        message: 'Faktura usunięta',
        devmessage: 'Invoice delated/invoice product delated',
        data: null
    };   



    }catch (error){ 
        console.error('Błąd usuwania faktury',error)
        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd usuwania faktury',
            devmessage: `${error}`,
            data: null
        };   


        res.status(404).json(response)
    }

}