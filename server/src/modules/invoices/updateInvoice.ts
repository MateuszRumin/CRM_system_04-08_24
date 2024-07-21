import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addInvocieClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {

       

        



    }catch (error){
        console.error('Błąd dodania nowego klienta',error)
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