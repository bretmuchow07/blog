import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Next.js stores local environment variables in .env.local
config({ path: '.env.local' });
config(); // fallback to .env if present

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
