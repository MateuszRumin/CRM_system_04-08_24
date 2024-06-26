import { Request, Response, NextFunction } from 'express';




exports.addNewNoteClient = (req: Request, res: Response, next: NextFunction) => {
   

    




    res.status(200).json(req.body.client_id)



}














