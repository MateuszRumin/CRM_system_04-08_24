import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  // Pobranie bieżącej daty
  const currentDate = new Date();
  
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
  let userRole = await prisma.userRoles.create({
    data:{
        user_id:1,
        role_id:1,
    }  
  })
  userRole = await prisma.userRoles.create({
    data:{
        user_id:2,
        role_id:1,
    }  
  })
  let Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:false,
        name:'Nie podjety'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:false,
        name:'W trakcie'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:false,
        name:'Zdobyty'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Klient',
        default:false,
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
        default:false,
        name:'W trakcie'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Zadanie',
        default:false,
        name:'Zrobiony'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Zadanie',
        default:false,
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
        default:false,
        name:'Oplacona'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:false,
        name:'Oczekuje na platnosc'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:false,
        name:'Wystawiona'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Faktura',
        default:false,
        name:'Zapisana'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Projekt',
        default:true,
        name:'Nie rozpoczety'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Projekt',
        default:false,
        name:'W trakcie realizacji'
    }  
  })
  Status = await prisma.statuses.create({
    data:{
        status_type:'Projekt',
        default:false,
        name:'Zakonczony'
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

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })