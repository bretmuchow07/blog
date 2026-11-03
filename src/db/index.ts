import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';

// In serverless deployment runtimes (e.g. Vercel), cap max connections per function
// to protect the database against connection pool exhaustion (DoS).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: isProduction ? 2 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(isProduction && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

export const db = drizzle(pool, { schema });
export type DbClient = typeof db;
