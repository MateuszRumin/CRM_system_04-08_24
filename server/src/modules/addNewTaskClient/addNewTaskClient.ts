import { Request, Response, NextFunction } from 'express';




exports.addNewTaskClient = (req: Request, res: Response, next: NextFunction) => {
   

    




res.status(200).json(req.body)



}