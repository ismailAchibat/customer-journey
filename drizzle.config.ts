// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './db/schema.ts', // Path to your schema file
  out: './drizzle', // Directory to store migration files
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Drizzle Kit uses this to connect
  },
  verbose: true,
  strict: true,
});