import { $, component$, NoSerialize, useSignal } from "@builder.io/qwik";
import { routeAction$, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import * as v from 'valibot';

// HAPUS import fs dan path karena tidak didukung di Edge/Cloudflare
import { db } from '~/lib/db';
import { posterKegiatanTable } from '~/db/schema';
import { eq } from 'drizzle-orm';

import { submit, useForm, type InitialValues } from '@modular-forms/qwik';

import { useFormFeedback } from '~/hooks/use-form-feedback';
import { Toast } from "~/components/toast";
import { Dialog } from "~/components/dialog";
import { PosterCard } from "~/components/poster-card";

const posterSchema = v.object({
    gambar:
    v.pipe(
        v.instance(File, 'Pilih gambar terlebih dahulu'),
        v.check((file) => file.size <= 2 * 1024 * 1024, 'Maksimal 2MB'),
        v.check((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Format salah')
    )
});

const updatePosterSchema = v.object({
    id: v.string(),
    new_gambar:
    v.pipe(
        v.instance(File, 'Pilih gambar terlebih dahulu'),
        v.check((file) => file.size <= 2 * 1024 * 1024, 'Maksimal 2MB'),
        v.check((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Format salah')
    )
});

type PosterForm = {
    gambar: NoSerialize<File>;    
};

type UpdatePosterForm = {
    id: number;
    new_gambar: any;
};

export const usePosterLoader = routeLoader$(
    async ({ platform }) => {
        try {
            const database = db((platform.env as Env).DB);
            
            // SQLite Drizzle: Mengambil semua data poster
            const data = await database
                .select()
                .from(posterKegiatanTable)
                .all();

            return {
                data: data,
                error: null
            };
        } catch {
            return {
                data: null,
                error: "Gagal memuat data dari database. Silakan periksa koneksi Anda."
            };
        }
    }
);

export const useFormLoader = routeLoader$<InitialValues<PosterForm>>(
    async () => {
        return {
            gambar: undefined
        };
    }
);

export const useUpdateFormLoader = routeLoader$<InitialValues<UpdatePosterForm>>(
    async () => {
        return {
            id: undefined,
            new_gambar: undefined
        };
    }
);

export const useFormAction = routeAction$(
    async (values, { fail, platform }) => {
        const result = v.safeParse(posterSchema, values);
        
        if (!result.success) {
            return fail(400, {
                values,
                errors: v.flatten(result.issues).nested as any,
                response: {}
            });
        }

        try {
            const file = result.output.gambar;
            const fileExtension = file.type.split('/')[1] || 'jpg';
            const fileName = `poster-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;

            // 1. Upload Gambar ke Cloudflare R2
            const bucket = (platform.env as Env).BAITURRAHIM_DISPLAY_BUCKET;
            const arrayBuffer = await file.arrayBuffer();
            await bucket.put(fileName, arrayBuffer, {
                httpMetadata: { contentType: file.type }
            });

            // 2. Simpan referensi nama file ke Cloudflare D1
            const database = db((platform.env as Env).DB);
            await database
                .insert(posterKegiatanTable)
                .values({
                    nama_file: fileName,
                    // URL ini akan kita buatkan endpoint terpisah nanti untuk membaca gambar dari R2
                    url_gambar: `/api/posters/${fileName}`,
                });

            const env = platform.env as Env;

            if (env.UPDATES_DO) {
                const doNamespace = env.UPDATES_DO;
                const id = doNamespace.idFromName("baiturrahim-room");
                const stub = doNamespace.get(id);

                // Tembakkan request POST ke Broker
                await stub.fetch(new Request("http://internal/broadcast", {
                    method: "POST",
                    body: JSON.stringify({ type: "refresh_poster" }) // Sesuaikan tipe: refresh_poster / refresh_finance
                }));
            }

            return {
                values: { ...values, gambar: undefined },
                errors: {},
                response: { message: 'Alhamdulillah, poster kegiatan berhasil ditambahkan.' }
            };
        } catch (error) {
            console.error(error);
            return fail(500, {
                values: { ...values, gambar: undefined },
                errors: {},
                response: { message: 'Gagal mengunggah gambar. Silakan coba lagi.' }
            });
        }
    }
);

export const useDeleteAction = routeAction$(async (data, { platform, fail }) => {
    const id = Number(data.id);
    const database = db((platform.env as Env).DB);
    const bucket = (platform.env as Env).BAITURRAHIM_DISPLAY_BUCKET;

    try {
        // Menggunakan .get() untuk SQLite
        const poster = await database
            .select()
            .from(posterKegiatanTable)
            .where(eq(posterKegiatanTable.id, id))
            .get();

        if (!poster) return fail(404, { response: { message: "Poster tidak ditemukan." } });

        // Hapus file fisik dari R2 Bucket
        await bucket.delete(poster.nama_file);

        // Hapus record dari Database D1
        await database.delete(posterKegiatanTable).where(eq(posterKegiatanTable.id, id));

        const env = platform.env as Env;

        if (env.UPDATES_DO) {
            const doNamespace = env.UPDATES_DO;
            const id = doNamespace.idFromName("baiturrahim-room");
            const stub = doNamespace.get(id);

            // Tembakkan request POST ke Broker
            await stub.fetch(new Request("http://internal/broadcast", {
                method: "POST",
                body: JSON.stringify({ type: "refresh_poster" }) // Sesuaikan tipe: refresh_poster / refresh_finance
            }));
        }

        return {
            response: { message: "Alhamdulillah, poster telah berhasil dihapus." }
        };
    } catch {
        return fail(500, {
            response: { message: "Gagal menghapus poster. Silakan coba lagi." }
        });
    }
});

export const useUpdateFormAction = routeAction$(
    async (values, { fail, platform }) => {
        const result = v.safeParse(updatePosterSchema, values);

        if (!result.success) {
            return fail(400, {
                values: { ...values, new_gambar: undefined },
                errors: v.flatten(result.issues).nested as any,
                response: {}
            });
        }
        
        const id = Number(values.id);
        const file = result.output.new_gambar;
        
        const database = db((platform.env as Env).DB);
        const bucket = (platform.env as Env).BAITURRAHIM_DISPLAY_BUCKET;

        try {
            // Gunakan .get() untuk SQLite
            const oldData = await database
                .select()
                .from(posterKegiatanTable)
                .where(eq(posterKegiatanTable.id, id))
                .get();

            if (!oldData) return fail(404, { 
                values: { ...values, new_gambar: undefined },
                errors: {},
                response: { message: "Data tidak ditemukan." }
            });

            // Hapus file lama dari R2 Bucket
            await bucket.delete(oldData.nama_file);

            // Siapkan file baru
            const fileExtension = file.type.split('/')[1] || 'jpg';
            const fileName = `poster-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
            
            // Upload file baru ke R2
            const arrayBuffer = await file.arrayBuffer();
            await bucket.put(fileName, arrayBuffer, {
                httpMetadata: { contentType: file.type }
            });

            // Update Database D1
            await database
                .update(posterKegiatanTable)
                .set({
                    nama_file: fileName,
                    url_gambar: `/api/posters/${fileName}`,
                })
                .where(eq(posterKegiatanTable.id, id));

            const env = platform.env as Env;

            if (env.UPDATES_DO) {
                const doNamespace = env.UPDATES_DO;
                const id = doNamespace.idFromName("baiturrahim-room");
                const stub = doNamespace.get(id);

                // Tembakkan request POST ke Broker
                await stub.fetch(new Request("http://internal/broadcast", {
                    method: "POST",
                    body: JSON.stringify({ type: "refresh_poster" }) // Sesuaikan tipe: refresh_poster / refresh_finance
                }));
            }

            return {
                values: { ...values, new_gambar: undefined },
                errors: {},
                response: { message: 'Alhamdulillah, poster berhasil diperbarui.' }
            };
        } catch {
            return fail(500, { 
                values: { ...values, new_gambar: undefined },
                errors: {},
                response: { message: "Gagal memperbarui poster." }
            });
        }
    }
);

export default component$(() => {
    const poster = usePosterLoader();

    const formAction = useFormAction();
    const formLoader = useFormLoader();

    const formUpdateAction = useUpdateFormAction();
    const formUpdateLoader = useUpdateFormLoader();

    const deleteAction = useDeleteAction();

    const selectedIdToDelete = useSignal<number | null>(null);
    const showConfirmDialog = useSignal(false);

    const [form, { Form, Field }] = useForm<PosterForm>({
        loader: formLoader,
        action: formAction
    });

    const [, { Form: FormUpdate, Field: FieldUpdate }] = useForm<UpdatePosterForm>({
        loader: formUpdateLoader,
        action: formUpdateAction
    });
    
    const uploadToast = useFormFeedback(formAction);
    const updateToast = useFormFeedback(formUpdateAction);
    const deleteToast = useFormFeedback(deleteAction);

    return (
        <>
            <Toast 
                status={uploadToast.status.value}
                message={uploadToast.message.value}
                isVisible={uploadToast.isVisible.value}
                onClose$={uploadToast.hideToast}
            />

            <Toast 
                status={updateToast.status.value}
                message={updateToast.message.value}
                isVisible={updateToast.isVisible.value}
                onClose$={updateToast.hideToast}
            />

            <Toast 
                status={deleteToast.status.value}
                message={deleteToast.message.value}
                isVisible={deleteToast.isVisible.value}
                onClose$={deleteToast.hideToast}
            />

            <Dialog
                isOpen={showConfirmDialog.value}
                title="Hapus Poster Ini?"
                description="Apakah Anda yakin ingin menghapus poster kegiatan ini? Poster yang sudah dihapus tidak dapat dikembalikan lagi."
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
                onClose$={() => showConfirmDialog.value = false}
                onConfirm$={$(async () => {
                    if (selectedIdToDelete.value) {
                        await deleteAction.submit({ id: selectedIdToDelete.value });
                        selectedIdToDelete.value = null;
                    }
                    showConfirmDialog.value = false;
                })}
            />

            <article class="w-full max-w-200 flex flex-col gap-y-4 font-roboto">
                <h1 class="text-custom-neutral-900 font-medium text-h2-small sm:text-h2-medium lg:text-h2-large">Kelola Poster Kegiatan</h1>
                <p class="text-custom-neutral-700 text-body-small sm:text-body-medium">Unggah gambar informasi atau jadwal kegiatan masjid untuk ditampilkan pada seluruh layar informasi secara otomatis.</p>
            </article>

            <div class="w-full bg-custom-neutral-100 h-px block self-center justify-self-center" />
                
                <div class="flex flex-col gap-6 *:grid *:grid-cols-3 *:gap-6">
                    
                    <FormUpdate encType="multipart/form-data">
                        <FieldUpdate name="new_gambar" type="File">
                            {(field, props) => (
                                <>
                                    {poster.value && poster.value.data?.map((poster) => (
                                        <PosterCard
                                            {...props}
                                            key={poster.id}
                                            src={poster.url_gambar}
                                            posterId={poster.id}

                                            name={field.name}
                                            value={field.value}

                                            deletePoster$={$(() => {
                                                selectedIdToDelete.value = poster.id;
                                                showConfirmDialog.value = true;
                                            })}
                        
                                            updatePoster$={$(async (formData) => {
                                                await formUpdateAction.submit(formData);
                                            })}

                                            // onChange$={$(async () => {
                                            //     await submit(formUpdate);
                                            // })}
                                        />
                                    ))}
                                </>
                            )}
                        </FieldUpdate>

                    </FormUpdate>

                    <Form encType="multipart/form-data">
                        <Field name="gambar" type="File">
                            {(field, props) => (
                                <PosterCard
                                    {...props}
                                    isAdd
                                    name={field.name}
                                    value={field.value}
                                    onChange$={$(() => {
                                        submit(form);
                                    })}
                                />
                            )}
                    </Field>

                    </Form>
                </div>
            
                <div class="w-full bg-custom-neutral-100 h-px block self-center justify-self-center" />
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