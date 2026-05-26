import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import * as v from 'valibot';

import { db } from '~/lib/db';
import { teksBerjalanTable } from '~/db/schema';
import { eq } from 'drizzle-orm';

import { useForm, type InitialValues } from '@modular-forms/qwik';
import { Button } from "~/components/button";
import { TextArea } from "~/components/text-field";

import { useFormFeedback } from '~/hooks/use-form-feedback';
import { Toast } from "~/components/toast";

const runningTextSchema = v.object({
    isi_teks: v.pipe(
        v.string(),
        v.minLength(1, 'Running text tidak boleh kosong')
    )
});

export const useFormLoader = routeLoader$<InitialValues<v.InferInput<typeof runningTextSchema>>>(
    async ({ platform }) => {
        try {
            const database = db((platform.env as Env).DB);
            
            // Menggunakan .get() untuk mengambil satu baris di SQLite
            const data = await database
                .select()
                .from(teksBerjalanTable)
                .where(eq(teksBerjalanTable.id, 1))
                .get();

            return {
                isi_teks: data?.isi_teks || '',
                error: null
            };
        } catch {
            return {
                isi_teks: '',
                error: "Gagal memuat data dari database. Silakan periksa koneksi Anda."
            };
        }
    }
);

export const useFormAction = routeAction$(
    async (values, { fail, platform }) => {
        const result = v.safeParse(runningTextSchema, values);

        if (!result.success) {
            return fail(400, {
                values,
                errors: v.flatten(result.issues).nested as any,
                response: {}
            });
        }

        try {
            const database = db((platform.env as Env).DB);
            
            await database
                .insert(teksBerjalanTable)
                .values({
                    id: 1,
                    isi_teks: result.output.isi_teks
                })
                // Menggunakan onConflictDoUpdate khusus untuk SQLite
                .onConflictDoUpdate({
                    target: teksBerjalanTable.id,
                    set: { isi_teks: result.output.isi_teks }
                });

            const env = platform.env as Env;

            if (env.UPDATES_DO) {
                const doNamespace = env.UPDATES_DO;
                const id = doNamespace.idFromName("baiturrahim-room");
                const stub = doNamespace.get(id);

                // Tembakkan request POST ke Broker
                await stub.fetch(new Request("http://internal/broadcast", {
                    method: "POST",
                    body: JSON.stringify({ type: "refresh_running_text" }) // Sesuaikan tipe: refresh_poster / refresh_finance
                }));
            }

            return {
                values,
                errors: {},
                response: { message: 'Alhamdulillah, tampilan Display Masjid berhasil diperbarui.' }
            };
        } catch (error) {
            console.error("Database Error: ", error);
            return fail(500, {
                values,
                errors: {},
                response: { message: 'Mohon maaf, terjadi kendala koneksi. Silakan coba tekan tombol perbarui sekali lagi.' }
            });
        }
    }
);

export default component$(() => {
    const formAction = useFormAction();
    const formLoader = useFormLoader();

    const [runningTextForm, { Form, Field }] = useForm<v.InferInput<typeof runningTextSchema>>({
        loader: formLoader,
        action: formAction
    });
    
    const toast = useFormFeedback(formAction, formLoader);

    return (
        <>
            <Toast 
                status={toast.status.value}
                message={toast.message.value}
                isVisible={toast.isVisible.value}
                onClose$={toast.hideToast}
            />

            <article class="w-full max-w-200 flex flex-col gap-y-4 font-roboto">
                <h1 class="text-custom-neutral-900 font-medium text-h2-small sm:text-h2-medium lg:text-h2-large">Kelola Teks Berjalan</h1>
                <p class="text-custom-neutral-700 text-body-small sm:text-body-medium">Tuliskan informasi atau pesan singkat untuk ditampilkan pada bagian bawah layar display masjid secara terus-menerus</p>
            </article>

            <div class="w-full bg-custom-neutral-100 h-px block self-center justify-self-center" />

            <Form class="flex flex-col gap-6">
                <Field
                    name="isi_teks"
                >
                    {(field, props) => (
                        <TextArea 
                            {...props}
                            value={field.value}
                            label="Isi Pesan Berjalan"
                            placeholder="Rapatkan shaf dan matikan telepon seluler saat salat berjamaah"
                            error={field.error}
                            errorPulse={runningTextForm.submitCount}
                            class="max-w-100"
                        />
                    )}
                </Field>

                <div class="w-full bg-custom-neutral-100 h-px block self-center justify-self-center" />

                <Button 
                    variant="primary"
                    size="large"
                    type="submit"
                    disabled={runningTextForm.submitting}
                >
                    Perbarui Tampilan Display
                </Button>
            </Form>
        </>
    );
});

export const head: DocumentHead = {
    title: "Masjid Baiturrahim",
    meta: [
        {
            name: "description",
            content: "Masjid Baiturrahim adalah sebuah masjid yang didirikan tahun 2006 di Pondok Benda, Pamulang, tepatnya di Gang Anggrek (Jl. Anggrek Rt 02/18)",
        },
    ],
};