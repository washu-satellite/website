import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/lib/db/migrations',
  schema: './src/lib/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    // host: process.env.POSTGRES_HOST!,
    // user: process.env.POSTGRES_USER!,
    // password: process.env.POSTGRES_PASSWORD!,
    // database: process.env.POSTGRES_DATABASE!,
    // ssl: ca ? { ca: ca, rejectUnauthorized: true } : undefined,
  },
});