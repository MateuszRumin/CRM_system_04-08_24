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
  let InvoiceType = await prisma.invoiceTypes.create({
    data:{
        invoice_type:'VAT',
    }  
  })
  InvoiceType = await prisma.invoiceTypes.create({
    data:{
        invoice_type:'Zaliczkowa',
    }  
  })
  InvoiceType = await prisma.invoiceTypes.create({
    data:{
        invoice_type:'Koncowa',
    }  
  })
  InvoiceType = await prisma.invoiceTypes.create({
    data:{
        invoice_type:'Proforma',
    }  
  })
  InvoiceType = await prisma.invoiceTypes.create({
    data:{
        invoice_type:'Okresowa',
    }  
  })
  // Create Companies
  const company1 = await prisma.companies.create({
    data: {
      name: 'Company One',
      address: '123 Main St',
      regon: '123456789',
      nip: '987654321',
      krs: '1111111111',
    },
  });

  // Create Invoice Payment Settings
  await prisma.invoicePaymentSettings.create({
    data: {
      advancement_rate: 10,
      tax_rate: 23,
      tax_type: 'brak',
      default_vat_amount: 5,
      company_id: company1.company_id,
    },
  });

  // Create Invoice Settings
  await prisma.invoiceSettings.create({
    data: {
      current_number_year: currentYear,
      current_number_month: currentMonth,
      current_number_sequence: 1,
      default_currency: 'PLN',
      template: 'Default Template',
      payment_term: 30,
      vat_enabled: true,
      advance_enabled: true,
      final_enabled: true,
      proforma_enabled: true,
      periodic_enabled: true,
      periodic_auto_generate: true,
      periodic_frequency: 'monthly',
      reminder_enabled: true,
      reminder_frequency: 7,
      reminder_content: 'Please pay your invoice.',
      reminder_channel_email: true,
      reminder_channel_sms: false,
      reminder_channel_push: false,
      company_id: company1.company_id,
    },
  });

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

  // Create Projects
  const project1 = await prisma.projects.create({
    data: {
      project_name: 'Project One',
      description: 'Description of project one',
    },
  });

  // Create Invoice Types
  const vatInvoiceType = await prisma.invoiceTypes.create({
    data: {
      invoice_type: 'VAT',
      numbering_format: 'FV_rok_miesiac_numer',
    },
  });

  // Create Invoices
  await prisma.invoices.create({
    data: {
      invoice_number: `FV/${currentYear}/${currentMonth}/001`,
      issue_date: currentDate,
      due_date: new Date(currentDate.setDate(currentDay + 30)),
      client_id: client1.client_id,
      invoice_type_id: vatInvoiceType.invoice_type_id,
      project_id: project1.project_id,
      status_id: 9,
      quantity: 10,
      unit_price: 100.0,
      net_amount: 1000.0,
      vat_amount: 230.0,
      note: 'First invoice',
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