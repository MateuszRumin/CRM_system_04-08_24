import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

exports.selectAllClients = async (req: Request, res: Response, next: NextFunction) => {
   
    const prisma = req.app.get('prisma')

    try{
        
        const selectDataClient = await  prisma.Clients.findMany({
            select:{
                client_id:true,
                registration_date:true,
                first_name:true,
                second_name:true,
                company_name:true,
                Status:{
                    select:{
                        status_id:true,
                        name:true,
                    }
                },
                Project:{
                    select:{
                        project_id:true,
                        status_id:true
                    }
                },
                Invoice:{
                    select:{
                        invoice_id:true,
                        invoice_type_id:true,
                        year:true,
                        month:true,
                        invoice_number:true,
                        issue_date:true,
                        due_date:true,
                        prize_netto:true,
                    }
                }
            }
        })

        const response: IResponse = {
            status: 'info',
            display: true,
            error: null,
            message: 'Wyswietlono dane kliętów',
            devmessage: `Success`,
            data: selectDataClient
        };  

        // 
       
        res.status(200).json(response)

    }catch (error){

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd pobierania danych',
            devmessage: `${error}`,
            data: null
        };   


        res.status(404).json(response)
    }
    




}