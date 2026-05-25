import { type RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params, platform, send, error }) => {
    // 1. Ambil nama file dari URL parameter (contoh: poster-123.jpg)
    const fileName = params.name;
    
    // 2. Hubungkan ke R2 Bucket
    const bucket = (platform.env as Env).BAITURRAHIM_DISPLAY_BUCKET;
    
    try {
        // 3. Cari objek gambar di dalam Bucket
        const object = await bucket.get(fileName);

        if (!object) {
            throw error(404, "Gambar poster tidak ditemukan");
        }

        // 4. Siapkan Headers (Agar browser tahu ini adalah gambar)
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        // 5. Kirim gambar langsung ke browser pengguna sebagai response stream
        send(new Response(object.body, { headers }));
        
    } catch (err) {
        console.info(err)
        throw error(500, "Gagal memuat gambar dari penyimpanan");
    }
};