import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.updateInvocieClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {

        const clientData = req.body.clieny
            
        const client = await  prisma.Clients.findFirst({
            select:{
                client_id:true,
                registration_date:true,
                first_name:true,
                second_name:true,
                Status:{
                    select:{
                        status_id:true,
                        name:true,
                        }
                    }
                },
            where:{
                data:{clientData}
            }
        })
            
        if (client !== null){
            next()
        }else{

            const clientUpdate = await prisma.Client.update({
                where:{
                    client_id:clientData.client_id
                },
                data:{                    
                    nip:clientData.nip,
                    regon:clientData.regon,
                    krs:clientData.krs,
                    address:clientData.address,
                    first_name:clientData.first_name,
                    second_name:clientData.second_name	  
                }          
            })

            console.log("Zmodyfikowano dane klięta");

            next()
        }
        



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