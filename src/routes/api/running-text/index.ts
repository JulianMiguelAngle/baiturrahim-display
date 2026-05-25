import { type RequestHandler } from '@builder.io/qwik-city';
import { db } from '~/lib/db';
import { teksBerjalanTable } from '~/db/schema';
import { eq } from 'drizzle-orm';

export const onGet: RequestHandler = async ({ json, platform }) => {
    const database = db((platform.env as Env).DB);

    const [data] = await database
        .select()
        .from(teksBerjalanTable)
        .where(eq(teksBerjalanTable.id, 1))
        .limit(1);

    if (!data) {
        json(200, { isi_teks: "Selamat Datang di Masjid Baiturrahim" });
    } else {
        json(200, data);
    }

};