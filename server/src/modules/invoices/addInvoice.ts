import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClientCheck = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {
        //pobranie danych z req
        const initData = req.body
        // pobranie id statusu 
        const status = await prisma.Statuses.findFirst({
            select:{
                status_id:true
            },
            where:{
                name:"Nie Wystawiona",
                status_type:"Faktura",
            }

        })

        //pobranie id typu faktury (ale to będzie z fronu przychodziło)
        const invoiceType = await prisma.InvoiceTypes.findFirst({
            select:{
                invoice_type_id:true
            },
            where:{
                invoice_type:initData.main.invoice_type,
            }

        })

        //iniciacja danych do bazy null na wszelki wypadek zależy od podejścia/ dla cen powinno być dobrze

        const insertData = {
            status_id:status.status_id,
            invoice_type_id:invoiceType.invoice_type_id ,
            client_id:initData.client.client_id,
            issue_date:initData.main.issue_date,
            due_date:initData.main.due_date,
            net_amount:initData.summary.net_amount || null,
            brutto_amount:initData.summary.brutto_amount || null,
            vat_amount:initData.summary.vat_amount || null,
            note:initData.summary.note || null
        }
        
        
        
        // push danych do bazy danych
 
        
        const invoice = await prisma.Invoices.create({
            data:insertData
        })


        console.log('Invoice created:', invoice);
        //przekazanie danych do dodania produktów
        req.body.invoice_id = invoice.invoice_id

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