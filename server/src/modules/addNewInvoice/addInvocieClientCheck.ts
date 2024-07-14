import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClientCheck = async (req: Request, res: Response, next: NextFunction) => {
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
                
            }
    
            initData.registration_date ? Object.assign(insertData, {registration_date:initData.registration_date}):void 0
            initData.regon  ? Object.assign(insertData, {regon:initData.regon}):void 0
            initData.nip ? Object.assign(insertData, {nip:initData.nip}):void 0
            initData.krs ? Object.assign(insertData, {krs:initData.krs}):void 0
            initData.company_name ? Object.assign(insertData, {company_name:initData.company_name}):void 0
            
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