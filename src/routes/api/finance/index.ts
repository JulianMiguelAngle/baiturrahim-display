import { type RequestHandler } from '@builder.io/qwik-city';
import { db } from '~/lib/db';
import { laporanKeuanganTable } from '~/db/schema';
import { eq } from 'drizzle-orm';

export const onGet: RequestHandler = async ({ json, platform }) => {
    // 1. Akses database melalui ekosistem platform Cloudflare
    const database = db((platform.env as Env).DB); 

    // 2. Eksekusi query menggunakan .get() khas SQLite Drizzle
    const data = await database
        .select()
        .from(laporanKeuanganTable)
        .where(eq(laporanKeuanganTable.id, 1))
        .get();

    if (!data) {
        json(200, []);
    } else {
        const formattedData = [
            {
                label: "Laporan Infaq Jumat",
                nominal: data.jumlah_infaq,
                tanggal: data.tanggal_infaq
            },
            {
                label: "Laporan Pengeluaran Jumat",
                nominal: data.jumlah_pengeluaran,
                tanggal: data.tanggal_pengeluaran
            },
            {
                label: "Kas Masjid",
                nominal: data.total_kas,
                tanggal: data.tanggal_kas
            }
        ];

        json(200, formattedData);
    }
};