import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  // Pobranie bieżącej daty
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Miesiące w JavaScript są indeksowane od 0
  const currentDay = currentDate.getDate();
  
  let admin = await prisma.users.create({
    data:{
        username:"Administrator",
        email:"Administrator@gmail.com",
        password:"administrator"
    }  
  })
  admin = await prisma.users.create({
    data:{
        username:"Administrator2",
        email:"Administrator2@gmail.com",
        password:"administrator"
    }  
  })
  admin = await prisma.users.create({
    data:{
        username:"Administrator3",
        email:"Administrator3@gmail.com",
        password:"administrator"
    }  
  })
  admin = await prisma.users.create({
    data:{
        username:"Administrator4",
        email:"Administrator4@gmail.com",
        password:"administrator"
    }  
  })

  let Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:true,
        name:'Niepodjęty'
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
        name:'Nie zaczęty'
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
        name:'Porażka'
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
  // Create Clients
  const client1 = await prisma.clients.create({
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