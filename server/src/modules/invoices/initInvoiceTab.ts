import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

interface MarkerLocal {
    marker_name: string;
    current_month_sequence: number;
    current_year_sequence: number;
    current_number_sequence: number;
}

interface InvoiceTypeLocal {
    invoice_type_id:Number;
    invoice_type: string;
    Marker: MarkerLocal;
}

exports.initInvoiceSite = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try {

        
        
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth()+1;
        
       const markers =  await prisma.markers.findMany({
            select:{
                marker_id:true,
                current_month_sequence:true,
                current_year_sequence:true,
                current_number_sequence:true,
            }
        })
    
        for (let marker of markers){
            if (marker.current_month_sequence !== currentMonth || marker.current_year_sequence !== currentYear){

                await prisma.markers.update({
                    where:{
                        marker_id:marker.marker_id
                    },
                    data:{
                        current_month_sequence:currentMonth,
                        current_year_sequence:currentYear,
                        current_number_sequence:1
                    }
                })

            }


        }

        const initInvSiteData = await prisma.invoiceTypes.findMany({
            select: {
                invoice_type_id:true,
                invoice_type: true,
                Marker: {
                    select: {
                        marker_name: true,
                        current_month_sequence: true,
                        current_year_sequence: true,
                        current_number_sequence: true
                    }
                }
            }
        });
        console.log(initInvSiteData);

        const mapInvInitData = initInvSiteData.flatMap((data: InvoiceTypeLocal) =>{
            return{
                invoice_type_id:data.invoice_type_id,
                invoice_type: data.invoice_type,
                marker_name: data.Marker.marker_name,
                current_month_sequence: data.Marker.current_month_sequence,
                current_year_sequence: data.Marker.current_year_sequence,
                current_number_sequence: data.Marker.current_number_sequence,
             } }
        )
        const resData = {
            inv_types:mapInvInitData
            
        }
        
        const response: IResponse = {
            status: 'success',
            display: true,
            error: null,
            message: 'Dane inicjacyjne',
            devmessage: `Pszesłano numery sekwencji oraz typy faktur`,
            data: resData
        };   
        
        res.status(200).json(response)

    }catch (error){
        console.error('Błąd inicjacji strony faktór ',error)
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