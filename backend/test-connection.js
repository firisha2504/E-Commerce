const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    console.log('Port:', process.env.DB_PORT);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    
    console.log('✅ Connected to MySQL server successfully!');
    
    // Test if database exists
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
    
    if (dbExists) {
      console.log('✅ Database fa_restaurant exists!');
    } else {
      console.log('❌ Database fa_restaurant does not exist!');
      console.log('Creating database...');
      await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('✅ Database created successfully!');
    }
    
    await connection.end();
    console.log('Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Make sure the database user has proper permissions');
  }
}

testConnection();