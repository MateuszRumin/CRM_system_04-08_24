import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';







exports.addNewClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')
    try  {
        
        const initData = req.body.client
        const insertData = {
            status_id: initData.status_id,
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

        
        req.body.client_id = client.client_id
        req.body.user_id = insertData.user_id

        

        
        next()

    }catch (error){

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania nowego klięta',
            devmessage: `${error}`,
            data: null
        };   

        res.status(302).json(response)
    }



    




   



}