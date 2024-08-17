import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  // Pobranie bieżącej daty
  // Pobranie bieżącej daty
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Miesiące w JavaScript są indeksowane od 0
  const currentDay = currentDate.getDate();
  
  // początkowe dane logowania admina:
  // username: "admin" lub "admin2"
  // password: "password"

  const users = [
    {
      username:"admin",
      email:"admin@weblance.com",
      password:"$2a$10$n.cHm7FalQmL5fHkCCQ4KO790LlMtBzZqHIsXv.qePJ7yHbEYarHu"
    },
    {
      username:"admin2",
      email:"admin2@weblance.com",
      password:"$2a$10$d16Y5ZIK2HxE/pqLSMLFFOHZh5Tf4Itvlb17.vUikYHybbsT7aQhm"
    },    
]


for (let userData  of users){
  
  await prisma.users.upsert({
    where:{username:userData.username},
    update:{},
    create:userData
    
  })
  
  const statusesClient = [
    {name:'Niepodjety'},
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

  const statusesProject = [
    {name:'Nie rozpoczety'},
    {name:'W trakcie realizacji'},    
    {name:'Zakonczony'},    
  ]
  
  for (let statusProject  of statusesProject){
    
    const existCheck = await prisma.statuses.findFirst({
      where:{
        status_type:'Projekt',
        default:true,
        name:statusProject.name
      }
    })
  
  if (!existCheck){
      await prisma.statuses.create({
        data:{
          status_type:'Projekt',
          default:true,
          name:statusProject.name
        }
      })
    }
  
  }
  
  
  const statuseZadania =[
    {name:'Nie zaczety'},
    {name:'W trakcie'},
    {name:'Zrobiony'},
    {name:'Porazka'}        
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
    {name:'Wystawiona'},
    {name:'Zaksiegowana'}            
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
////////////////////////////////////////
  const statusesInvoicePayment = [
    {name:'Oczekuje na platnosc'},
    {name:'Oplacona'},
    {name:'Nie oplacona'},           
  ]

  for (let statusInvoicePayment  of statusesInvoicePayment){
    
    const existCheck = await prisma.statuses.findFirst({
      where:{
        status_type:'Platnosc',
        default:true,
        name:statusInvoicePayment.name
      }
    })
  
  if (!existCheck){
      await prisma.statuses.create({
        data:{
          status_type:'Platnosc',
          default:true,
          name:statusInvoicePayment.name
        }
      })
    }
  
  }
  
  const statusForClientNiepodjent = await prisma.statuses.findFirst({
    where:{
      status_type:'Klient',
      default:true,
      name:"Niepodjety"
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
              
        const existCheck = await prisma.clients.findFirst({
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
where:{invoice_type:"VAT"},
update:{},
create:{
  invoice_type:"VAT",
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

let position = await prisma.companyPositions.upsert({
  where: { name: 'Programista' },
  update: {},
  create: { name: 'Programista' },
});
  position = await prisma.companyPositions.create({
    data: {
      name: 'Sieciowiec',
    },
  });
  position = await prisma.companyPositions.create({
    data: {
      name: 'Designer UI',
    },
  });
  position = await prisma.companyPositions.create({
    data: {
      name: 'Ksiegowy',
    },
  });
  let role = await prisma.roles.create({
    data: {
      name: 'Admin',
    },
  });
  role = await prisma.roles.create({
    data: {
      name: 'Moderator',
    },
  });
  role = await prisma.roles.create({
    data: {
      name: 'User',
    },
  });
  let module = await prisma.modules.create({
    data: {
      name: 'User management',
    },
  });
  module = await prisma.modules.create({
    data: {
      name: 'Project management',
    },
  });
  module = await prisma.modules.create({
    data: {
      name: 'Invoice management',
    },
  });
  let permission = await prisma.permissions.create({
    data: {
      module_id: 1,
      role_id: 1,
      access: true
    },
  });
  permission = await prisma.permissions.create({
    data: {
      module_id: 2,
      role_id: 1,
      access: true
    },
  });
  permission = await prisma.permissions.create({
    data: {
      module_id: 3,
      role_id: 1,
      access: true
    },
  });
  permission = await prisma.permissions.create({
    data: {
      module_id: 1,
      role_id: 2,
      access: false
    },
  });
}

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