const db = require('./postgres');

const initialCatches = [
  {
    species: 'Robalo',
    weight: 2.5,
    length: 45,
    location: 'Lagoa da Conceição',
    weather: 'Ensolarado'
  },
  {
    species: 'Corvina',
    weight: 3.2,
    length: 52,
    location: 'Praia da Armação',
    weather: 'Nublado'
  }
];

const initialSpots = [
  { name: 'Pesqueiro Maeda', catches_count: 45, rating: 4.8, latitude: -23.4892, longitude: -46.5731 },
  { name: 'Represa Billings', catches_count: 38, rating: 4.6, latitude: -23.7833, longitude: -46.5667 },
  { name: 'Represa Guarapiranga', catches_count: 32, rating: 4.5, latitude: -23.7167, longitude: -46.7333 },
  { name: 'Lago do Taboão', catches_count: 28, rating: 4.4, latitude: -23.6167, longitude: -46.7833 },
  { name: 'Pesqueiro Taquari', catches_count: 25, rating: 4.7, latitude: -23.5500, longitude: -46.6333 },
  { name: 'Represa de Ponte Nova', catches_count: 22, rating: 4.3, latitude: -23.4833, longitude: -46.4167 },
  { name: 'Pesqueiro Rancho Alegre', catches_count: 20, rating: 4.5, latitude: -23.5167, longitude: -46.8500 },
  { name: 'Lago Parque Ibirapuera', catches_count: 18, rating: 4.2, latitude: -23.5875, longitude: -46.6575 }
];

async function migrate() {
  console.log('🔄 Starting database migration...\n');

  try {
    // Testar conexão
    console.log('1️⃣ Testing database connection...');
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Migrar capturas
    console.log('\n2️⃣ Migrating catches...');
    for (const catchData of initialCatches) {
      const created = await db.catches.create(catchData);
      console.log(`   ✅ Created catch: ${created.species} (${created.weight}kg)`);
    }

    // Migrar pontos de pesca
    console.log('\n3️⃣ Migrating fishing spots...');
    for (const spot of initialSpots) {
      const created = await db.spots.create(spot);
      console.log(`   ✅ Created spot: ${created.name} (rating: ${created.rating})`);
    }

    // Verificar dados migrados
    console.log('\n4️⃣ Verifying migration...');
    const catches = await db.catches.findAll();
    const spots = await db.spots.findAll();
    console.log(`   📊 Total catches: ${catches.length}`);
    console.log(`   📍 Total spots: ${spots.length}`);

    console.log('\n✅ Migration completed successfully!\n');
    console.log('🎯 Next steps:');
    console.log('   1. Open Beekeeper Studio');
    console.log('   2. Connect to database: fishingapp');
    console.log('   3. View tables: catches, fishing_spots\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   - PostgreSQL is installed and running');
    console.error('   - Database "fishingapp" exists');
    console.error('   - Schema has been executed (schema.sql)');
    console.error('   - .env file has correct credentials\n');
    process.exit(1);
  } finally {
    await db.close();
  }
}

migrate();
