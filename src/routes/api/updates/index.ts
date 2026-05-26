import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ platform, request, send }) => {
    const env = platform.env as Env;
    
    // Panggil Namespace DO yang sudah kita daftarkan di wrangler.jsonc
    const doNamespace = env.UPDATES_DO;
    
    // Pastikan semua TV masuk ke "ruangan" yang sama
    const id = doNamespace.idFromName("baiturrahim-room");
    const stub = doNamespace.get(id);

    // Teruskan request GET dari browser TV langsung ke Broker
    const response = await stub.fetch(request);
    
    throw send(response);
};