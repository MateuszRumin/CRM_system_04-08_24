import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export const addNewTaskClientbyId = async (req: Request, res: Response, next: NextFunction) => {
    const { client_id } = req.params;
    const { user_id, tasks } = req.body;

    try {
        const clientId = parseInt(client_id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        const existingClient = await prisma.clients.findUnique({
            where: { client_id: clientId }
        });

        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        for (const taskData of tasks) {
            const statusId = parseInt(taskData.status_id, 10);
            if (isNaN(statusId)) {
                return res.status(400).json({ error: 'Invalid status_id parameter' });
            }

            let insertData: any = {
                status_id: statusId,
                task_text: taskData.task_text,
                user_id: user_id
            };

            if (taskData.task_name) insertData.task_name = taskData.task_name;
            if (taskData.deadline) insertData.deadline = taskData.deadline;
            if (taskData.created_at) insertData.created_at = taskData.created_at;

            const task = await prisma.tasks.create({
                data: insertData
            });

            await prisma.clientTasks.create({
                data: {
                    client_id: clientId,
                    task_id: task.task_id
                }
            });
        }

        res.status(201).json({ message: 'Tasks added successfully' });
    } catch (error) {
        console.error('Error adding tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};