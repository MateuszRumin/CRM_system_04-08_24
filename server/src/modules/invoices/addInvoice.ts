import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocie = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {
        //pobranie danych z req
        const initData = req.body
        // pobranie id statusu 
        const status_data = await prisma.Statuses.findFirst({
            select:{
                status_id:true,
                name:true,
            },
            where:{
                name:"Nie Wystawiona",
                status_type:"Faktura",
            }

        })
        console.log(status_data);

        //iniciacja danych do bazy null na wszelki wypadek zależy od podejścia/ dla cen powinno być dobrze

        const insertData = {
            block:false,
            year:null,
            month:null,
            invoice_number:null,
            status_id:initData.main.status_id ? initData.main.status_id : status_data.status_id,
            invoice_type_id:initData.main.invoice_type_id,
            client_id:initData.client.client_id,
            issue_date:null,
            due_date:null,
            prize_netto:initData.summary.prize_netto || null,
            prize_brutto:initData.summary.prize_brutto || null,
            tax_ammount:initData.summary.tax_ammount || null,
            comments:initData.summary.comments || null
        }
        
        
        let invoice
        // push danych do bazy danych
        if ( initData.main.invoice_id == null){
        
            invoice = await prisma.Invoices.create({
                data:insertData  
            })

        }else{
            invoice = await prisma.Invoices.update({
                data:insertData,
                where:{
                    invoice_id:initData.main.invoice_id
                }
            })  

        }

        
        //przekazanie danych do dodania produktów
        req.body.main.invoice_id = invoice.invoice_id

        res.json("oisadjfaosf")

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