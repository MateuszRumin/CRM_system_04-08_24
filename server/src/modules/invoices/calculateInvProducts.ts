import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';



exports.caculateInvProducts = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {


        
        const products = req.body.products
        
        let newProductsAmmount = {
            summary:{
                net_amount:0,
                brutto_amount:0,
                vat_amount:0,
                note:req.body.summary.note
            }
        }

        const settings = prisma.InvoicePaymentSettings.findFirst({
            select:{
                advancement_rate:true,   
                tax_rate:true,           
                tax_type:true,          
                default_vat_amount:true, 
                company_id:true         
            }
        })

        const procentage = settings.advancement_rate ? settings.advancement_rate : settings.default_vat_amount

        







        for (let product of products){

            if (product.project_id !== null){
                const existingProjectFV = await prisma.InvoiceProducts.findMeny({
                    where:{
                        project_id:product.project_id
                    },
                    select:{
                        
                    }
                })




            }else{



            }

        }
        




        
    }catch (error){
        console.error('Error adding invoice products', error);

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania nowej faktury',
            devmessage: `${error}`,
            data: null
        };   


        res.status(404).json(response)
    }



    



}