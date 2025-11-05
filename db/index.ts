// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // Import all your schemas

// Use the DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// Create the Postgres.js client instance
// If using the Supabase pooler in 'transaction' mode, it's best to disable prepare:
const client = postgres(connectionString, { prepare: false });

// Pass the client and schema to the Drizzle function
export const db = drizzle(client, { schema });

// You can now use 'db' in your server components or API routes