import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {

        if (req.body.client.client_id == null){
            const initData = req.body.client
            const status = await prisma.Statuses.findFirst({
                select:{
                    status_id:true
                },
                where:{
                    name:"Zdobyty",
                    status_type:"Klient",
                }
    
            })

            const insertData = {
                status_id: status.status_id,
                user_id: initData.user_id,
                client_type: initData.client_type,
                first_name: initData.first_name,
                second_name: initData.second_name,
                address: initData.address,
                registration_date: initData.registration_date || new Date(),
                regon: initData.regon || 'brak',
                nip: initData.nip || 'brak',
                krs: initData.krs || 'brak',
                company_name: initData.company_name || 'brak'
            };

            const client = await prisma.Clients.create({
                data:insertData
            })

            req.body.client.client_id = client.client_id

            next()

        }else{
             
            next()
        }
    




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