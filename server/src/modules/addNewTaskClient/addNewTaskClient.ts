import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

exports.addNewTaskClient = async (req: Request, res: Response, next: NextFunction) => {
   
    const prisma = req.app.get('prisma')

    try{
        const user_id = req.body.user_id
        
        const client_id = req.body.client_id
        const taskDatas = req.body.tasks
        
        for ( let taskData of taskDatas){

            const status = await prisma.Statuses.findFirst({
                select:{
                    status_id:true
                },
                where:{
                    status_type:'Zadanie',
                    name:taskData.status_name
                }
    
            })            
            
            let insertData = {
                status_id:status.status_id,
                task_text:taskData.task_text,
                user_id:user_id
            } 

            taskData.task_name ? Object.assign(insertData, {task_name:taskData.task_name}):void 0
            taskData.deadline ? Object.assign(insertData, {deadline:taskData.deadline}):void 0
            taskData.created_at ? Object.assign(insertData, {created_at:taskData.created_at}):void 0


            let task = await prisma.Tasks.create({
                data:insertData
            })

            await prisma.ClientTasks.create({
                data: {
                    client_id: client_id,
                    task_id: task.task_id
                }
            });

        }

        const response: IResponse = {
            status: 'info',
            display: true,
            error: null,
            message: 'Dodano, klięta, notatki,zadania',
            devmessage: `Fill database Succes`,
            data: null
        };

        next();

    }catch (error){

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania taskow nowego klięta',
            devmessage: `${error}`,
            data: null
        };   


        res.status(404).json(response)
    }
}