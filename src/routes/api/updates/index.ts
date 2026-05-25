// routes/api/updates/index.ts
import { type RequestHandler } from '@builder.io/qwik-city';
import { sseHub } from '~/lib/sse-hub';

export const onGet: RequestHandler = async ({ getWritableStream, request, headers }) => {
    // 1. Atur Headers secara manual
    headers.set('Content-Type', 'text/event-stream');
    headers.set('Cache-Control', 'no-cache');
    headers.set('Connection', 'keep-alive');

    // 2. Ambil WritableStream dan buat writer-nya
    const writable = getWritableStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Fungsi untuk mengirim data ke client
    const onUpdate = async (type: string) => {
        const message = `data: ${JSON.stringify({ type, timestamp: Date.now() })}\n\n`;
        await writer.write(encoder.encode(message));
    };

    // Dengarkan sinyal dari sseHub
    sseHub.on('update', onUpdate);

    // Kirim ping agar koneksi tetap hidup (Keep-alive)
    const keepAlive = setInterval(async () => {
        try {
            await writer.write(encoder.encode(': keep-alive\n\n'));
        } catch {
            // Mengabaikan error jika koneksi sudah tertutup
        }
    }, 30000);

    // 3. Bersihkan resource saat koneksi diputus oleh client
    request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        sseHub.off('update', onUpdate);
        writer.close();
    });
};