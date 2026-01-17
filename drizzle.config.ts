import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const ca = process.env.POSTGRES_CA
  ? Buffer.from(process.env.POSTGRES_CA, 'base64').toString('utf8')
  : undefined;

export default defineConfig({
  out: './src/lib/db/migrations',
  schema: './src/lib/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
    ssl: ca ? { ca: ca, rejectUnauthorized: true } : undefined,
  },
});