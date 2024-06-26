import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  
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