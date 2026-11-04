import { drizzle } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';

declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env?.DB) {
    throw new Error(
      'Cloudflare D1 database binding "DB" is not available in the current context.'
    );
  }
  return drizzle(env.DB, { schema });
}

export type DbClient = Awaited<ReturnType<typeof getDb>>;
