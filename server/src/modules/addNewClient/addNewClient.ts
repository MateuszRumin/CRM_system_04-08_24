import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.addNewClient = (req: Request, res: Response, next: NextFunction) => {
   

    const response: IResponse = {
        status: 'info',
        display: true,
        error: null,
        message: 'Operation completed successfully.',
        devmessage: 'This is a developer message.',
        data: [{ key: 'value' }]
    };   




    res.status(200).json(response)



}