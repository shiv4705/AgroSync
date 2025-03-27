import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Parse PostgreSQL connection URL from environment variable
const postgresUrl = process.env.POSTGRES_URL;

// Extract database name from URL
const urlParts = new URL(postgresUrl);
const dbName = urlParts.pathname.substring(1); // Remove leading '/'

// First create a connection to the default 'postgres' database to check if our target DB exists
const { Client } = pg;

async function createDatabaseIfNotExists() {
  // Create a client connected to the default 'postgres' database
  const client = new Client({
    host: urlParts.hostname,
    port: urlParts.port || 5432,
    user: urlParts.username,
    password: urlParts.password,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname='${dbName}'`;
    const result = await client.query(checkDbQuery);
    
    if (result.rows.length === 0) {
      console.log(`Database '${dbName}' not found, creating...`);
      // Create the database if it doesn't exist
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error);
  } finally {
    await client.end();
  }
}

// Initialize Sequelize with the URL from .env
const sequelize = new Sequelize(postgresUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
});

// Function to initialize the database connection
export async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to PostgreSQL database:', error);
    throw error;
  }
}

export default sequelize;
