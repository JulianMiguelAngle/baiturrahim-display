import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'sqlite',
    driver: 'd1-http',
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
        token: process.env.CLOUDFLARE_D1_TOKEN!,
        // url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/dec4aa01969c859813d98c2c839cfc1dfedb8d1f4717809bd273c6045ed8d32c.sqlite'
    },
});