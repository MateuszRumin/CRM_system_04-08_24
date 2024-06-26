import { Request, Response, NextFunction } from 'express';




exports.addNewTaskClient = (req: Request, res: Response, next: NextFunction) => {
   

    const client_id = req.body.client_id




    res.status(200).json("Dzień dobry")



}