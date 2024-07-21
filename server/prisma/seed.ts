import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  // Pobranie bieżącej daty
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Miesiące w JavaScript są indeksowane od 0
  const currentDay = currentDate.getDate();
  
  const users = [
    {
      username:"Administrator",
      email:"Administrator@gmail.com",
      password:"administrator"
    },
    {
      username:"Administrator2",
      email:"Administrator2@gmail.com",
      password:"administrator"
    },
    {
      username:"Administrator3",
      email:"Administrator3@gmail.com",
      password:"administrator"
    },
    {
      username:"Administrator4",
      email:"Administrator4@gmail.com",
      password:"administrator"
    }      
]


for (let userData  of users){
  
  await prisma.users.upsert({
    where:{username:userData.username},
    update:{},
    create:userData
    
  })

}

const statusesClient = [
  {name:'Niepodjęty'},
  {name:'W trakcie'},    
  {name:'Zdobyty'},
  {name:'Stracony'}     
]

for (let statusClient  of statusesClient){
  
  const existCheck = await prisma.statuses.findFirst({
    where:{
      status_type:'Klient',
      default:true,
      name:statusClient.name
    }
  })

if (!existCheck){
    await prisma.statuses.create({
      data:{
        status_type:'Klient',
        default:true,
        name:statusClient.name
      }
    })
  }

}


const statuseZadania =[
  {name:'Nie zaczęty'},
  {name:'W trakcie'},
  {name:'Zrobiony'},
  {name:'Porażka'}        
]


for (let statusZadanie  of statuseZadania){
  
  const existCheck = await prisma.statuses.findFirst({
    where:{
      status_type:'Zadanie',
      default:true,
      name:statusZadanie.name
    }
  })

if (!existCheck){
    await prisma.statuses.create({
      data:{
        status_type:'Zadanie',
        default:true,
        name:statusZadanie.name
      }
    })
  }

}


const statusesInvoice = [
  {name:'Nie wystawiona'},
  {name:'Nie oplacona'},
  {name:'Oplacona'},
  {name:'Oczekuje na platnosc'},
  {name:'Wystawiona'},
  {name:'Zaksięgowana'}            
]

for (let statusInvoice  of statusesInvoice){
  
  const existCheck = await prisma.statuses.findFirst({
    where:{
      status_type:'Faktura',
      default:true,
      name:statusInvoice.name
    }
  })

if (!existCheck){
    await prisma.statuses.create({
      data:{
        status_type:'Faktura',
        default:true,
        name:statusInvoice.name
      }
    })
  }

}





const statusForClientNiepodjent = await prisma.statuses.findFirst({
  where:{
    status_type:'Klient',
    default:true,
    name:"Niepodjęty"
  }
})


const clientCompanyDatas = [
  {   
    status_id: statusForClientNiepodjent? statusForClientNiepodjent.status_id : 1,
    user_id:1,
   
    first_name: 'John',
    second_name: 'Doe',
    regon: '123456789',
    nip: '987654321',
    krs: '1111111111',
    company_name: 'Doe Inc.',
    address: '456 Elm St',
  }
]

for (let clientData  of clientCompanyDatas){
            
      const existCheck = await prisma.clients.findUnique({
        where:{
          nip:clientData.nip
        }
      })

      if(!existCheck){

        await prisma.clients.create({
          data:{
            ...clientData,
            client_type:"Firma", 
          }        
         })
      }        
}


//znaczniki do faktór
await prisma.markers.upsert({
    where:{ marker_name:"FV"},
    update:{},
    create:{
      marker_name:`FV`,
      current_month_sequence:currentMonth, 
      current_year_sequence:currentYear, 
      current_number_sequence:1,
    }
  })

await prisma.markers.upsert({
    where:{ marker_name:"FZ"},
    update:{},
    create:{
      marker_name:`FZ`,
      current_month_sequence:currentMonth, 
      current_year_sequence:currentYear, 
      current_number_sequence:1,
    }
  })

//typy faktur
await prisma.invoiceTypes.upsert({
  where:{invoice_type:"Zaliczkowa"},
  update:{},
  create:{
    invoice_type:"Zaliczkowa",
    enabled:true,
    Marker:{ connect:{marker_name:"FZ"}}
  }
})
await prisma.invoiceTypes.upsert({
  where:{invoice_type:"Vat"},
  update:{},
  create:{
    invoice_type:"Vat",
    enabled:true,
    Marker:{ connect:{marker_name:"FV"}}
  }
})
await prisma.invoiceTypes.upsert({
  where:{invoice_type:"Okresowa"},
  update:{},
  create:{
    invoice_type:"Okresowa",
    enabled:true,
    Marker:{ connect:{marker_name:"FV"}}
  }
})
await prisma.invoiceTypes.upsert({
  where:{invoice_type:"Koncowa"},
  update:{},
  create:{
    invoice_type:"Koncowa",
    enabled:true,
    Marker:{ connect:{marker_name:"FV"}}
  }
})















}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })