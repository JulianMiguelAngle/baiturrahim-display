import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import * as v from 'valibot';

import { db } from '~/lib/db';
import { laporanKeuanganTable } from '~/db/schema';
import { eq } from 'drizzle-orm';

import { useForm, type InitialValues } from '@modular-forms/qwik';
import { Button } from "~/components/button";

import { useFormFeedback } from '~/hooks/use-form-feedback';
import { Toast } from "~/components/toast";
import { Input } from "~/components/input";
import { sseHub } from "~/lib/sse-hub";

export const laporanKeuanganSchema = v.object({
    jumlah_infaq: v.pipe(
        v.number('Wajib berupa angka'),
        v.minValue(0, 'Minimal 0')
    ),
    tanggal_infaq: v.pipe(
        v.string(),
        v.minLength(1, 'Tanggal infaq wajib diisi')
    ),
    jumlah_pengeluaran: v.pipe(
        v.number('Wajib berupa angka'), 
        v.minValue(0, 'Minimal 0')
    ),
    tanggal_pengeluaran: v.pipe(
        v.string(),
        v.minLength(1, 'Tanggal pengeluaran wajib diisi')
    ),
    total_kas: v.pipe(
        v.number('Wajib berupa angka'), 
        v.minValue(0, 'Minimal 0')
    ),
    tanggal_kas: v.pipe(
        v.string(),
        v.minLength(1, 'Tanggal pembaruan kas wajib diisi')
    ),
});

export const useFormLoader = routeLoader$<InitialValues<v.InferInput<typeof laporanKeuanganSchema>>>(
    async ({ platform }) => {
        const defaultValues = {
            jumlah_infaq: 0,
            tanggal_infaq: '',
            jumlah_pengeluaran: 0,
            tanggal_pengeluaran: '',
            total_kas: 0,
            tanggal_kas: '',
        };
        
        try {
            const database = db((platform.env as Env).DB);
            
            // Menggunakan .get() khusus untuk SQLite
            const data = await database
                .select()
                .from(laporanKeuanganTable)
                .where(eq(laporanKeuanganTable.id, 1))
                .get(); 

            return {
                ...(data || defaultValues),
                error: null
            };
        } catch {
            return {
                ...defaultValues,
                error: "Gagal memuat data dari database. Silakan periksa koneksi Anda."
            };
        }
    }
);

export const useFormAction = routeAction$(
    async (values, { fail, platform }) => {
        const result = v.safeParse(laporanKeuanganSchema, values);

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
                .insert(laporanKeuanganTable)
                .values({ id: 1, ...result.output })
                // Sintaks khusus SQLite untuk menangani duplikasi ID (Upsert)
                .onConflictDoUpdate({ 
                    target: laporanKeuanganTable.id,
                    set: result.output 
                });

            sseHub.emit('update', 'refresh_finance');

            return {
                values,
                errors: {},
                response: { message: 'Alhamdulillah, laporan keuangan berhasil diperbarui.' }
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

    const [keuanganForm, { Form, Field }] = useForm<v.InferInput<typeof laporanKeuanganSchema>>({
        loader: formLoader,
        action: formAction
    });
    
    const toast = useFormFeedback(formAction);

    return (
        <>
            <Toast 
                status={toast.status.value}
                message={toast.message.value}
                isVisible={toast.isVisible.value}
                onClose$={toast.hideToast}
            />

            <article class="w-full max-w-200 flex flex-col gap-y-4 font-roboto">
                <h1 class="text-custom-neutral-900 font-medium text-h2-small sm:text-h2-medium lg:text-h2-large">Kelola Laporan Keuangan</h1>
                <p class="text-custom-neutral-700 text-body-small sm:text-body-medium">Masukkan data infaq, pengeluaran, dan saldo kas terbaru agar jemaah dapat melihat laporan keuangan masjid secara transparan di layar</p>
            </article>

            <div class="w-full bg-custom-neutral-100 h-px block self-center justify-self-center" />

            <Form class="flex flex-col gap-6 font-roboto">
                <div class="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-x-12 gap-y-8">
                    <div class="flex flex-col gap-6">
                        <h2 class="text-h3-small md:text-h3-medium lg:text-h3-large font-medium text-custom-neutral-800">Laporan Infaq Jumat</h2>
                        <Field name="jumlah_infaq" type="number">
                            {(field, props) => (
                                <Input {...props} value={field.value} label="Jumlah Infaq (Rp)" placeholder="Contoh: 1.500.000" error={field.error} type="number" />
                            )}
                        </Field>
                        <Field name="tanggal_infaq">
                            {(field, props) => (
                                <Input {...props} type="date" value={field.value} label="Tanggal Infaq" error={field.error} />
                            )}
                        </Field>
                    </div>

                    <div class="flex flex-col gap-6">
                        <h2 class="text-h3-small md:text-h3-medium lg:text-h3-large font-medium text-custom-neutral-800">Laporan Pengeluaran Masjid</h2>
                        <Field name="jumlah_pengeluaran" type="number">
                            {(field, props) => (
                                <Input {...props} value={field.value} label="Jumlah Pengeluaran (Rp)" placeholder="Contoh: 200.000" error={field.error} type="number" />
                            )}
                        </Field>
                        <Field name="tanggal_pengeluaran">
                            {(field, props) => (
                                <Input {...props} type="date" value={field.value} label="Tanggal Pengeluaran" error={field.error} />
                            )}
                        </Field>
                    </div>

                    <div class="flex flex-col gap-6 max-w-md">
                        <h2 class="text-h3-small md:text-h3-medium lg:text-h3-large font-medium text-custom-neutral-800">Tanggal Pembaruan Kas</h2>
                        <Field name="total_kas" type="number">
                            {(field, props) => (
                                <Input {...props} value={field.value} label="Total Kas Saat Ini (Rp)" placeholder="Contoh: 10.000.000" error={field.error} type="number" />
                            )}
                        </Field>
                        <Field name="tanggal_kas">
                            {(field, props) => (
                                <Input {...props} type="date" value={field.value} label="Tanggal Pembaruan Kas" error={field.error} />
                            )}
                        </Field>
                    </div>
                </div>

                <div class="w-full bg-custom-neutral-100 h-px block self-center justify-self-center" />

                <Button 
                    variant="primary"
                    size="large"
                    type="submit"
                    disabled={keuanganForm.submitting}
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