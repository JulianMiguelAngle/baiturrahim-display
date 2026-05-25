import { drizzle } from 'drizzle-orm/d1';
import { hash } from "bcryptjs";
import { usersTable } from "~/db/schema";
import 'dotenv/config';

// Definisikan antarmuka mock untuk D1Database agar TypeScript tidak protes di luar worker
const createMockD1 = (executeFn: (sql: string, params: any[]) => Promise<any>): D1Database => {
    return {
        prepare: (sql: string) => ({
            bind: (...params: any[]) => ({
                run: () => executeFn(sql, params),
                all: () => executeFn(sql, params),
                get: () => executeFn(sql, params),
            }),
            run: () => executeFn(sql, []),
            all: () => executeFn(sql, []),
            get: () => executeFn(sql, []),
        }),
        exec: (sql: string) => executeFn(sql, []),
    } as unknown as D1Database;
};

const main = async () => {
    // 1. Ambil Kredensial dari .env
    const rawUsername = process.env.SEED_ADMIN_USERNAME;
    const rawPassword = process.env.SEED_ADMIN_PASSWORD;
    const dbName = process.env.CLOUDFLARE_DATABASE_NAME;

    if (!rawUsername || !rawPassword || !dbName) {
        console.error("❌ Gagal: Pastikan SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD, dan CLOUDFLARE_DATABASE_NAME sudah terisi di .env");
        process.exit(1);
    }

    console.log("Seed: Menghash password secara aman...");
    const hashedPassword = await hash(rawPassword, 14);

    // 2. Gunakan dynamic import execa atau child_process untuk menjembatani Drizzle ke Wrangler CLI
    const { execSync } = require('child_process');

    const mockD1 = createMockD1(async (sqlText, params) => {
        // Transformasi query Drizzle ke format eksekusi wrangler CLI
        const jsonParams = JSON.stringify(params);
        const command = `npx wrangler d1 execute ${dbName} --remote --command=${JSON.stringify(sqlText)} --params=${JSON.stringify(jsonParams)}`;
        
        try {
            const result = execSync(command, { encoding: 'utf-8' });
            return JSON.parse(result);
        } catch (err) {
            // Jika butuh seeding ke database lokal, bisa gunakan flag --local
            throw err;
        }
    });

    const db = drizzle(mockD1);

    console.log(`Seed: Memasukkan data admin '${rawUsername}' ke Cloudflare D1...`);

    try {
        await db.insert(usersTable).values({
            fullname: "Admin Masjid Baiturrahim",
            username: rawUsername,
            password: hashedPassword,
        });

        console.log("=========================================");
        console.log("✅ Berhasil! Akun admin telah dibuat di Cloudflare D1.");
        console.log(`Username: ${rawUsername}`);
        console.log("=========================================");
    } catch (error) {
        console.error("❌ Gagal membuat user admin:", error);
    }
};

main();