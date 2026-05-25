// src/routes/api/posters/index.ts
import { type RequestHandler } from '@builder.io/qwik-city';
import { db } from '~/lib/db';
import { posterKegiatanTable } from '~/db/schema';
import { desc } from 'drizzle-orm';

export const onGet: RequestHandler = async ({ json, platform }) => {
    const database = db((platform.env as Env).DB);
    const data = await database
        .select()
        .from(posterKegiatanTable)
        .orderBy(desc(posterKegiatanTable.dibuat_pada));

    json(200, data);
};