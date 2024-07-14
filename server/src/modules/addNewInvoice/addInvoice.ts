import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClientCheck = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {

        const initData = req.body
        const status = await prisma.Statuses.findFirst({
            select:{
                status_id:true
            },
            where:{
                name:"Nie Wystawiona",
                status_type:"Faktura",
            }

        })
        const invoiceType = await prisma.Statuses.findFirst({
            select:{
                invoice_type_id:true
            },
            where:{
                invoice_type:initData.main.invoice_type,
            }

        })

        const insertData = {
            status_id:status.status_id,
            invoice_type_id:invoiceType.invoice_type_id,
            invoice_number:initData.main.invoice_number,
            client_id:initData.client.client_id,
            issue_date:initData.main.issue_date,
            due_date:initData.main.due_date

        }

        





        const invoice = await prisma.Notes.create({
            data:insertData
        })
    

    }catch (error){

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania nowego klięta',
            devmessage: `${error}`,
            data: null
        };   


        res.status(404).json(response)
    }



    



}