import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users, sites } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const [user] = await db.insert(users)
    .values({ email: 'dev@example.com' })
    .onConflictDoNothing()
    .returning();

  if (user) {
    await db.insert(sites).values([
      { ownerId: user.id, hostname: 'example.com' },
      { ownerId: user.id, hostname: 'localhost.test' },
    ]);
  }
  console.log('Seeded');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });