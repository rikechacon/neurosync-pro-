const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixSchema() {
  try {
    console.log('🔧 Modificando schema para hacer beat_freq opcional...');
    
    await pool.query(`
      ALTER TABLE routines 
      ALTER COLUMN beat_freq DROP NOT NULL;
    `);
    
    console.log('✅ beat_freq ahora es opcional');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

fixSchema();
