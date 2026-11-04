/**
 * scripts/seed.ts
 * Cloudflare D1 seed runner.
 * To seed your D1 database, run:
 *   Local:  npm run db:seed:local   (wrangler d1 execute blog-db --local --file=./drizzle/seed.sql)
 *   Remote: npm run db:seed:remote  (wrangler d1 execute blog-db --remote --file=./drizzle/seed.sql)
 */

import { execSync } from 'child_process';

const isRemote = process.argv.includes('--remote');
const target = isRemote ? '--remote' : '--local';

console.log(`🌱 Seeding Cloudflare D1 database (${isRemote ? 'remote' : 'local'})...`);

try {
  execSync(`npx wrangler d1 execute blog-db ${target} --file=./drizzle/seed.sql`, {
    stdio: 'inherit',
  });
  console.log('✅ D1 Seed complete.');
} catch (error) {
  console.error('❌ D1 Seed failed:', error);
  process.exit(1);
}
