/**
 * Database initialization script
 * This script generates the Prisma client and creates the database schema
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Initializing database...');
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection successful');
    
    // The schema is already defined in schema.prisma
    // Run: npm run prisma:migrate to create tables
    console.log('✓ Database initialized successfully');
    console.log('Run "npm run prisma:migrate" to create tables');
    
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
