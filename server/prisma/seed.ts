import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  // Pobranie bieżącej daty
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Miesiące w JavaScript są indeksowane od 0
  const currentDay = currentDate.getDate();
  
  //username: admin
  //password: admin

  let admin = await prisma.users.create({
    data:{
        username:"admin",
        email:"admin@weblance.com",
        password:"$2a$10$0lZqJhfN7AtDbHK6VCxnU.8jmHWN6LQuVsqtV5Dp4KFhSs3gliKJm"
    }  
  })
  admin = await prisma.users.create({
    data:{
        username:"admin2",
        email:"admin22@weblance.com",
        password:"$2a$10$0lZqJhfN7AtDbHK6VCxnU.8jmHWN6LQuVsqtV5Dp4KFhSs3gliKJm"
    }  
  })
  

  let Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:true,
        name:'Nie podjety'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:true,
        name:'W trakcie'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:true,
        name:'Zdobyty'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:true,
        name:'Stracony'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Zadanie',
        default:true,
        name:'Nie zaczety'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Zadanie',
        default:true,
        name:'W trakcie'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Zadanie',
        default:true,
        name:'Zrobiony'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Zadanie',
        default:true,
        name:'Porazka'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:true,
        name:'Nie oplacona'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:true,
        name:'Oplacona'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:true,
        name:'Oczekuje na platnosc'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:true,
        name:'Wystawiona'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:true,
        name:'Zapisana'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Pojekt',
        default:true,
        name:'W trakcie realizacji'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Pojekt',
        default:true,
        name:'W trakcie realizacji'
    }  
  })
  // Create Clients
  let client = await prisma.clients.create({
    data: {
      status_id: 1,
      user_id: 1,
      client_type: 'Prywatny',
      first_name: 'John',
      second_name: 'Doe',
      regon: '123456789',
      nip: '987654321',
      krs: '1111111111',
      company_name: 'Doe Inc.',
      address: '456 Elm St',
    },
  });
  let position = await prisma.companyPositions.create({
    data: {
      name: 'Programista',
    },
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
  let role = await prisma.roles.create({
    data: {
      name: 'Admin',
    },
  });
  position = await prisma.companyPositions.create({
    data: {
      name: 'Moderator',
    },
  });
  position = await prisma.companyPositions.create({
    data: {
      name: 'User',
    },
  });
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