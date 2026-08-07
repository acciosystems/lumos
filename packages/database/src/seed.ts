import { prisma } from './index';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const ids = {
  users: {
    instituto: '01BX5ZZKBKACTAV9WEVGEMMW0A',
    coletivo: '01BX5ZZKBKACTAV9WEVGEMMW0B',
    ana: '01BX5ZZKBKACTAV9WEVGEMMW0C',
    bruno: '01BX5ZZKBKACTAV9WEVGEMMW0D',
    carla: '01BX5ZZKBKACTAV9WEVGEMMW0E',
  },
  organizers: {
    instituto: 'seed-organizer-instituto-esperanca',
    coletivo: 'seed-organizer-coletivo-solidario',
  },
  campaigns: {
    food: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
    winter: '01BX5ZZKBKACTAV9WEVGEMMVRZ',
    flood: '01BX5ZZKBKACTAV9WEVGEMMVS0',
    school: '01BX5ZZKBKACTAV9WEVGEMMVS1',
  },
  collectionPoints: {
    institute: '01BX5ZZKBKACTAV9WEVGEMMVS2',
    market: '01BX5ZZKBKACTAV9WEVGEMMVS3',
    communityCenter: '01BX5ZZKBKACTAV9WEVGEMMVS4',
    library: '01BX5ZZKBKACTAV9WEVGEMMVS5',
  },
  updates: {
    food: '01BX5ZZKBKACTAV9WEVGEMMVS6',
    winter: '01BX5ZZKBKACTAV9WEVGEMMVS7',
  },
} as const;

const usernames = {
  instituto: `ins_${ids.users.instituto.toLowerCase()}`,
  coletivo: `col_${ids.users.coletivo.toLowerCase()}`,
  ana: `ana_${ids.users.ana.toLowerCase()}`,
  bruno: `bru_${ids.users.bruno.toLowerCase()}`,
  carla: `car_${ids.users.carla.toLowerCase()}`,
} as const;

function daysFromNow(days: number) {
  return new Date(Date.now() + days * DAY_IN_MS);
}

async function seed() {
  await Promise.all([
    prisma.user.upsert({
      where: { id: ids.users.instituto },
      update: {
        name: 'Instituto Esperanca',
        email: 'instituto.esperanca@example.com',
        emailVerified: true,
        username: usernames.instituto,
        displayUsername: usernames.instituto,
      },
      create: {
        id: ids.users.instituto,
        name: 'Instituto Esperanca',
        email: 'instituto.esperanca@example.com',
        emailVerified: true,
        username: usernames.instituto,
        displayUsername: usernames.instituto,
      },
    }),
    prisma.user.upsert({
      where: { id: ids.users.coletivo },
      update: {
        name: 'Coletivo Solidario',
        email: 'coletivo.solidario@example.com',
        emailVerified: true,
        username: usernames.coletivo,
        displayUsername: usernames.coletivo,
      },
      create: {
        id: ids.users.coletivo,
        name: 'Coletivo Solidario',
        email: 'coletivo.solidario@example.com',
        emailVerified: true,
        username: usernames.coletivo,
        displayUsername: usernames.coletivo,
      },
    }),
    prisma.user.upsert({
      where: { id: ids.users.ana },
      update: {
        name: 'Ana Souza',
        email: 'ana.souza@example.com',
        emailVerified: true,
        username: usernames.ana,
        displayUsername: usernames.ana,
      },
      create: {
        id: ids.users.ana,
        name: 'Ana Souza',
        email: 'ana.souza@example.com',
        emailVerified: true,
        username: usernames.ana,
        displayUsername: usernames.ana,
      },
    }),
    prisma.user.upsert({
      where: { id: ids.users.bruno },
      update: {
        name: 'Bruno Lima',
        email: 'bruno.lima@example.com',
        emailVerified: true,
        username: usernames.bruno,
        displayUsername: usernames.bruno,
      },
      create: {
        id: ids.users.bruno,
        name: 'Bruno Lima',
        email: 'bruno.lima@example.com',
        emailVerified: true,
        username: usernames.bruno,
        displayUsername: usernames.bruno,
      },
    }),
    prisma.user.upsert({
      where: { id: ids.users.carla },
      update: {
        name: 'Carla Mendes',
        email: 'carla.mendes@example.com',
        emailVerified: true,
        username: usernames.carla,
        displayUsername: usernames.carla,
      },
      create: {
        id: ids.users.carla,
        name: 'Carla Mendes',
        email: 'carla.mendes@example.com',
        emailVerified: true,
        username: usernames.carla,
        displayUsername: usernames.carla,
      },
    }),
  ]);

  await Promise.all([
    prisma.organizerProfile.upsert({
      where: { id: ids.organizers.instituto },
      update: {
        userId: ids.users.instituto,
        type: 'ORGANIZATION',
        displayName: 'Instituto Esperanca',
        bio: 'Organizacao dedicada a seguranca alimentar e apoio comunitario.',
        websiteUrl: 'https://example.com/instituto-esperanca',
        cnpj: '12345678000195',
        cpnjVerified: true,
      },
      create: {
        id: ids.organizers.instituto,
        userId: ids.users.instituto,
        type: 'ORGANIZATION',
        displayName: 'Instituto Esperanca',
        bio: 'Organizacao dedicada a seguranca alimentar e apoio comunitario.',
        websiteUrl: 'https://example.com/instituto-esperanca',
        cnpj: '12345678000195',
        cpnjVerified: true,
      },
    }),
    prisma.organizerProfile.upsert({
      where: { id: ids.organizers.coletivo },
      update: {
        userId: ids.users.coletivo,
        type: 'INDIVIDUAL',
        displayName: 'Coletivo Solidario',
        bio: 'Rede de voluntarios que mobiliza doacoes em Sao Paulo.',
        websiteUrl: null,
        cnpj: null,
        cpnjVerified: false,
      },
      create: {
        id: ids.organizers.coletivo,
        userId: ids.users.coletivo,
        type: 'INDIVIDUAL',
        displayName: 'Coletivo Solidario',
        bio: 'Rede de voluntarios que mobiliza doacoes em Sao Paulo.',
      },
    }),
  ]);

  await Promise.all([
    prisma.campaign.upsert({
      where: { id: ids.campaigns.food },
      update: {
        organizerProfileId: ids.organizers.instituto,
        title: 'Alimentos para familias da Zona Leste',
        description:
          'Arrecadacao de cestas basicas e alimentos nao pereciveis para familias acompanhadas pelo instituto.',
        status: 'ACTIVE',
        type: 'PHYSICAL',
        category: 'Alimentacao',
        region: 'Sao Paulo - SP',
        startDate: daysFromNow(-7),
        endDate: daysFromNow(30),
        location: 'Tatuape, Sao Paulo',
        targetItems: 500,
        currentItems: 185,
      },
      create: {
        id: ids.campaigns.food,
        organizerProfileId: ids.organizers.instituto,
        title: 'Alimentos para familias da Zona Leste',
        description:
          'Arrecadacao de cestas basicas e alimentos nao pereciveis para familias acompanhadas pelo instituto.',
        status: 'ACTIVE',
        type: 'PHYSICAL',
        category: 'Alimentacao',
        region: 'Sao Paulo - SP',
        startDate: daysFromNow(-7),
        endDate: daysFromNow(30),
        location: 'Tatuape, Sao Paulo',
        targetItems: 500,
        currentItems: 185,
      },
    }),
    prisma.campaign.upsert({
      where: { id: ids.campaigns.winter },
      update: {
        organizerProfileId: ids.organizers.coletivo,
        title: 'Campanha do agasalho 2026',
        description:
          'Recebemos casacos, cobertores e roupas de inverno em bom estado para distribuicao durante as noites frias.',
        status: 'ACTIVE',
        type: 'PHYSICAL',
        category: 'Vestuario',
        region: 'Campinas - SP',
        startDate: daysFromNow(-2),
        endDate: daysFromNow(45),
        location: 'Centro, Campinas',
        targetItems: 800,
        currentItems: 126,
      },
      create: {
        id: ids.campaigns.winter,
        organizerProfileId: ids.organizers.coletivo,
        title: 'Campanha do agasalho 2026',
        description:
          'Recebemos casacos, cobertores e roupas de inverno em bom estado para distribuicao durante as noites frias.',
        status: 'ACTIVE',
        type: 'PHYSICAL',
        category: 'Vestuario',
        region: 'Campinas - SP',
        startDate: daysFromNow(-2),
        endDate: daysFromNow(45),
        location: 'Centro, Campinas',
        targetItems: 800,
        currentItems: 126,
      },
    }),
    prisma.campaign.upsert({
      where: { id: ids.campaigns.flood },
      update: {
        organizerProfileId: ids.organizers.instituto,
        title: 'Apoio emergencial para familias afetadas pelas chuvas',
        description:
          'Doacoes financeiras para compra local de agua, produtos de higiene e materiais de limpeza.',
        status: 'ACTIVE',
        type: 'VIRTUAL',
        category: 'Emergencia',
        region: 'Rio Grande do Sul',
        startDate: daysFromNow(-10),
        endDate: daysFromNow(20),
        pixKey: 'ajuda.chuvas@example.com',
        bankAccountInfo: 'Banco 001, agencia 1234, conta 56789-0',
      },
      create: {
        id: ids.campaigns.flood,
        organizerProfileId: ids.organizers.instituto,
        title: 'Apoio emergencial para familias afetadas pelas chuvas',
        description:
          'Doacoes financeiras para compra local de agua, produtos de higiene e materiais de limpeza.',
        status: 'ACTIVE',
        type: 'VIRTUAL',
        category: 'Emergencia',
        region: 'Rio Grande do Sul',
        startDate: daysFromNow(-10),
        endDate: daysFromNow(20),
        pixKey: 'ajuda.chuvas@example.com',
        bankAccountInfo: 'Banco 001, agencia 1234, conta 56789-0',
      },
    }),
    prisma.campaign.upsert({
      where: { id: ids.campaigns.school },
      update: {
        organizerProfileId: ids.organizers.coletivo,
        title: 'Material escolar para o novo semestre',
        description:
          'Campanha concluida para arrecadar cadernos, mochilas, lapis e estojos para estudantes da rede publica.',
        status: 'COMPLETED',
        type: 'PHYSICAL',
        category: 'Educacao',
        region: 'Sao Paulo - SP',
        startDate: daysFromNow(-75),
        endDate: daysFromNow(-30),
        location: 'Vila Mariana, Sao Paulo',
        targetItems: 300,
        currentItems: 342,
      },
      create: {
        id: ids.campaigns.school,
        organizerProfileId: ids.organizers.coletivo,
        title: 'Material escolar para o novo semestre',
        description:
          'Campanha concluida para arrecadar cadernos, mochilas, lapis e estojos para estudantes da rede publica.',
        status: 'COMPLETED',
        type: 'PHYSICAL',
        category: 'Educacao',
        region: 'Sao Paulo - SP',
        startDate: daysFromNow(-75),
        endDate: daysFromNow(-30),
        location: 'Vila Mariana, Sao Paulo',
        targetItems: 300,
        currentItems: 342,
      },
    }),
  ]);

  await Promise.all([
    prisma.campaignCollectionPoint.upsert({
      where: { id: ids.collectionPoints.institute },
      update: {
        campaignId: ids.campaigns.food,
        name: 'Sede do Instituto',
        address: 'Rua Serra de Braganca, 850',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '03318-000',
        lat: null,
        lon: null,
        instructions: 'Entregas de segunda a sexta, das 9h as 17h.',
      },
      create: {
        id: ids.collectionPoints.institute,
        campaignId: ids.campaigns.food,
        name: 'Sede do Instituto',
        address: 'Rua Serra de Braganca, 850',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '03318-000',
        instructions: 'Entregas de segunda a sexta, das 9h as 17h.',
      },
    }),
    prisma.campaignCollectionPoint.upsert({
      where: { id: ids.collectionPoints.market },
      update: {
        campaignId: ids.campaigns.food,
        name: 'Mercado Parceiro',
        address: 'Avenida Celso Garcia, 2210',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '03014-000',
        lat: null,
        lon: null,
        instructions: null,
      },
      create: {
        id: ids.collectionPoints.market,
        campaignId: ids.campaigns.food,
        name: 'Mercado Parceiro',
        address: 'Avenida Celso Garcia, 2210',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '03014-000',
      },
    }),
    prisma.campaignCollectionPoint.upsert({
      where: { id: ids.collectionPoints.communityCenter },
      update: {
        campaignId: ids.campaigns.winter,
        name: 'Centro Comunitario',
        address: 'Rua Barreto Leme, 1550',
        city: 'Campinas',
        state: 'SP',
        zipCode: '13010-201',
        lat: null,
        lon: null,
        instructions: 'Aos sabados, das 10h as 16h.',
      },
      create: {
        id: ids.collectionPoints.communityCenter,
        campaignId: ids.campaigns.winter,
        name: 'Centro Comunitario',
        address: 'Rua Barreto Leme, 1550',
        city: 'Campinas',
        state: 'SP',
        zipCode: '13010-201',
        instructions: 'Aos sabados, das 10h as 16h.',
      },
    }),
    prisma.campaignCollectionPoint.upsert({
      where: { id: ids.collectionPoints.library },
      update: {
        campaignId: ids.campaigns.school,
        name: 'Biblioteca do Bairro',
        address: 'Rua Domingos de Morais, 1420',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '04010-200',
        lat: null,
        lon: null,
        instructions: null,
      },
      create: {
        id: ids.collectionPoints.library,
        campaignId: ids.campaigns.school,
        name: 'Biblioteca do Bairro',
        address: 'Rua Domingos de Morais, 1420',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '04010-200',
      },
    }),
  ]);

  await Promise.all([
    prisma.campaignParticipant.upsert({
      where: { campaignId_userId: { campaignId: ids.campaigns.food, userId: ids.users.ana } },
      update: { confirmedAt: daysFromNow(-5), cancelledAt: null },
      create: {
        campaignId: ids.campaigns.food,
        userId: ids.users.ana,
        confirmedAt: daysFromNow(-5),
      },
    }),
    prisma.campaignParticipant.upsert({
      where: { campaignId_userId: { campaignId: ids.campaigns.food, userId: ids.users.bruno } },
      update: { confirmedAt: daysFromNow(-4), cancelledAt: null },
      create: {
        campaignId: ids.campaigns.food,
        userId: ids.users.bruno,
        confirmedAt: daysFromNow(-4),
      },
    }),
    prisma.campaignParticipant.upsert({
      where: { campaignId_userId: { campaignId: ids.campaigns.food, userId: ids.users.carla } },
      update: { confirmedAt: null, cancelledAt: null },
      create: { campaignId: ids.campaigns.food, userId: ids.users.carla },
    }),
    prisma.campaignParticipant.upsert({
      where: { campaignId_userId: { campaignId: ids.campaigns.winter, userId: ids.users.ana } },
      update: { confirmedAt: daysFromNow(-1), cancelledAt: null },
      create: {
        campaignId: ids.campaigns.winter,
        userId: ids.users.ana,
        confirmedAt: daysFromNow(-1),
      },
    }),
    prisma.campaignParticipant.upsert({
      where: { campaignId_userId: { campaignId: ids.campaigns.winter, userId: ids.users.carla } },
      update: { confirmedAt: null, cancelledAt: null },
      create: { campaignId: ids.campaigns.winter, userId: ids.users.carla },
    }),
    prisma.campaignParticipant.upsert({
      where: { campaignId_userId: { campaignId: ids.campaigns.school, userId: ids.users.bruno } },
      update: { confirmedAt: daysFromNow(-45), cancelledAt: null },
      create: {
        campaignId: ids.campaigns.school,
        userId: ids.users.bruno,
        confirmedAt: daysFromNow(-45),
      },
    }),
  ]);

  await Promise.all([
    prisma.campaignUpdate.upsert({
      where: { id: ids.updates.food },
      update: {
        campaignId: ids.campaigns.food,
        authorId: ids.users.instituto,
        message: 'Atingimos mais de um terco da meta. Obrigado a todos que ja participaram!',
        publishedAt: daysFromNow(-1),
      },
      create: {
        id: ids.updates.food,
        campaignId: ids.campaigns.food,
        authorId: ids.users.instituto,
        message: 'Atingimos mais de um terco da meta. Obrigado a todos que ja participaram!',
        publishedAt: daysFromNow(-1),
      },
    }),
    prisma.campaignUpdate.upsert({
      where: { id: ids.updates.winter },
      update: {
        campaignId: ids.campaigns.winter,
        authorId: ids.users.coletivo,
        message: 'O ponto de coleta tambem estara aberto neste sabado.',
        publishedAt: daysFromNow(-1),
      },
      create: {
        id: ids.updates.winter,
        campaignId: ids.campaigns.winter,
        authorId: ids.users.coletivo,
        message: 'O ponto de coleta tambem estara aberto neste sabado.',
        publishedAt: daysFromNow(-1),
      },
    }),
  ]);

  await prisma.donation.upsert({
    where: { id: 'seed-donation-school-supplies' },
    update: {
      campaignId: ids.campaigns.school,
      donorId: ids.users.bruno,
      itemCount: 25,
      itemDescription: 'Cadernos, lapis e estojos',
      status: 'COMPLETED',
      confirmedAt: daysFromNow(-40),
    },
    create: {
      id: 'seed-donation-school-supplies',
      campaignId: ids.campaigns.school,
      donorId: ids.users.bruno,
      itemCount: 25,
      itemDescription: 'Cadernos, lapis e estojos',
      status: 'COMPLETED',
      confirmedAt: daysFromNow(-40),
    },
  });

  await prisma.campaignAccountability.upsert({
    where: { campaignId: ids.campaigns.school },
    update: {
      totalItems: 342,
      submittedAt: daysFromNow(-25),
      submittedOnTime: true,
      notes: 'Os materiais foram separados em 57 kits e entregues a duas escolas publicas.',
      evidencesUrls: ['https://example.com/prestacao-de-contas/material-escolar'],
    },
    create: {
      campaignId: ids.campaigns.school,
      totalItems: 342,
      notes: 'Os materiais foram separados em 57 kits e entregues a duas escolas publicas.',
      evidencesUrls: ['https://example.com/prestacao-de-contas/material-escolar'],
      submittedOnTime: true,
      submittedAt: daysFromNow(-25),
    },
  });

  process.stdout.write('Database seeded successfully.\n');
}

try {
  await seed();
} finally {
  await prisma.$disconnect();
}
