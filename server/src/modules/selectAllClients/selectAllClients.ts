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
                Status:{
                    select:{
                        status_id:true,
                        name:true,
                    }
                }
            }
        })

        const response: IResponse = {
            status: 'info',
            display: true,
            error: null,
            message: 'Dodano, klięta, notatki,zadania',
            devmessage: `Fill database Succes`,
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