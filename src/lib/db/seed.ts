import { seed } from 'drizzle-seed'
import { db } from '.';
import { userSchema } from 'better-auth';

async function triggerSeed() {
    await seed(db, { userSchema }, { count: 20 });
}

triggerSeed()
  .then(() => {
    console.log("Seeded database");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  });