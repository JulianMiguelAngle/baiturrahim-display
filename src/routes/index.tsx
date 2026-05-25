import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { db } from '~/lib/db';
import { laporanKeuanganTable, posterKegiatanTable, teksBerjalanTable } from '~/db/schema';
import { desc, eq } from 'drizzle-orm';

import { DisplayHeader } from "~/components/display-header";

// import logoMasjid from '@public/Logo.avif';
import { PrayerHour } from "~/components/prayer-hour";
import { PrayerApiResponse, PrayerSchedule } from "~/types/prayer";
import { FinanceInfo } from "~/components/finance-info";
import { RunningText } from "~/components/running-text";
import { PosterSlider } from "~/components/poster-slider";
import { Calendar, Finance, Poster, Prayer, RunningText as RunningTextType } from "~/types/api";


export const useCalendarLoader = routeLoader$(async () => {
    const endpoint = "https://api.myquran.com/v3/cal/today?adj=0&tz=Asia%2FJakarta";

    try {
        const response = await fetch(endpoint);
        const result: Calendar = await response.json();

        if (!result.status) {
            throw new Error("Gagal mengambil data kalender dari API");
        }

        return {
            gregorian: result.data.ce.today,
            hijri: result.data.hijr.today,
        };
    } catch (error) {
        console.error("Error Calendar Loader:", error);
        return null;
    }
});

export const usePrayerLoader = routeLoader$(async (): Promise<PrayerApiResponse | null> => {
    const KOTA_ID = "82aa4b0af34c2313a562076992e50aa3";
    const endpoint = `https://api.myquran.com/v3/sholat/jadwal/${KOTA_ID}/today?tz=Asia%2FJakarta`;

    try {
        const response = await fetch(endpoint);
        const result: Prayer = await response.json();

        if (!result.status) throw new Error("Gagal mengambil data");

        const jadwalHariIni = Object.values(result.data.jadwal)[0] as PrayerSchedule;

        return {
            kabko: result.data.kabko,
            prov: result.data.prov,
            jadwal: jadwalHariIni,
        };
    } catch (error) {
        console.error("Error Prayer Loader:", error);
        return null;
    }
});

export const useFinanceLoader = routeLoader$(async ({ platform }) => {
    try {
        // Inisialisasi database
        const database = db((platform.env as Env).DB);

        // Query mengambil baris tunggal (ID = 1)
        const [data] = await database
            .select()
            .from(laporanKeuanganTable)
            .where(eq(laporanKeuanganTable.id, 1))
            .limit(1);

        if (!data) return [];

        // Mapping hasil query ke format yang dibutuhkan FinanceInfo
        return [
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
    } catch (err) {
        console.error("Gagal memuat data keuangan:", err);
        return [];
    }
});

export const useRunningTextLoader = routeLoader$(async ({ platform }) => {
    try {
        // Inisialisasi koneksi database
        const database = db((platform.env as Env).DB);

        // Query mengambil baris tunggal teks berjalan (ID = 1)
        const [data] = await database
            .select()
            .from(teksBerjalanTable)
            .where(eq(teksBerjalanTable.id, 1))
            .limit(1);

        if (!data) {
            return {
                isi_teks: "Selamat Datang di Masjid Baiturrahim - Menuju Masyarakat Islami yang Madani"
            };
        }

        return {
            isi_teks: data.isi_teks
        };
    } catch (err) {
        console.error("Gagal memuat teks berjalan:", err);
        return {
            isi_teks: ""
        };
    }
});

export const usePosterLoader = routeLoader$(async ({ platform }) => {
    try {
        const database = db((platform.env as Env).DB);

        // Query mengambil semua data poster
        // Diurutkan berdasarkan 'dibuat_pada' terbaru agar poster paling baru muncul duluan
        const data: Poster = await database
            .select()
            .from(posterKegiatanTable)
            .orderBy(desc(posterKegiatanTable.dibuat_pada));

        return {
            posters: data,
            error: null
        };
    } catch (err) {
        console.error("Gagal memuat data poster:", err);
        return {
            posters: [],
            error: "Gagal memuat data poster."
        };
    }
});

export default component$(() => {
    const calendar = useCalendarLoader();
    const prayer = usePrayerLoader();
    const financeLoader = useFinanceLoader();
    const runningTextLoader = useRunningTextLoader();
    const posterLoader = usePosterLoader();

    const postersData = useSignal(posterLoader.value.posters);
    const financeData = useSignal(financeLoader.value);
    const runningTextData = useSignal(runningTextLoader.value.isi_teks);

    const currentTime = useSignal("--:--:--");

    const updatePosters = $(async () => {
        try {
            const res = await fetch('/api/posters');
            if (res.ok) {
                const newData: Poster = await res.json();

				if (newData.length > 0) {
					postersData.value = newData;
				}
                console.info("Poster diperbarui secara real-time");
            }
        } catch (err) {
            console.error("Gagal mengambil data poster terbaru:", err);
        }
    });

    const updateFinance = $(async () => {
        const res = await fetch('/api/finance');
        if (res.ok) {
            const newData: Finance = await res.json();
            // Sekarang newData adalah Array, cocok dengan FinanceInfo
            financeData.value = newData; 
            console.info("Data Keuangan diperbarui");
        }
    });

    const updateRunningText = $(async () => {
        try {
            const res = await fetch('/api/running-text');
            if (res.ok) {
                const data: RunningTextType = await res.json();
                // Validasi: Pastikan data.isi_teks ada
                if (data && data.isi_teks) {
                    runningTextData.value = data.isi_teks;
                    console.info("Teks Berjalan berhasil diperbarui ke:", data.isi_teks);
                }
            }
        } catch (err) {
            console.error("Gagal fetch running text:", err);
        }
    });
    
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const updateTime = () => {
            const now = new Date();
            currentTime.value = now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).replace(/\./g, ':');
        };
        
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
        const eventSource = new EventSource('/api/updates');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // Logika percabangan update berdasarkan tipe sinyal
            if (data.type === 'refresh_poster') updatePosters();
            if (data.type === 'refresh_finance') updateFinance();
            if (data.type === 'refresh_running_text') updateRunningText();
            if (data.type === 'refresh_all') {
                updatePosters();
                updateFinance();
                updateRunningText();
            }
        };

        cleanup(() => eventSource.close());
    });

    return (
        <div class="flex flex-col h-screen bg-custom-neutral-base overflow-hidden">
            {calendar.value && (
                <DisplayHeader
                    time={currentTime.value}
                    dateGregorian={calendar.value.gregorian}
                    dateHijri={calendar.value.hijri}
                    logoSrc="/Logo.avif"
                />
            )}

            <main class="flex flex-1 flex-col lg:flex-row overflow-hidden items-stretch">
                {prayer.value && (
                    <PrayerHour 
                        jadwal={prayer.value.jadwal} 
                        class="lg:w-[320px]" 
                    />
                )}

                <section class="flex-1 bg-white relative overflow-hidden border-x border-custom-neutral-50">
                    {postersData.value && (
                         <PosterSlider 
                            posters={postersData.value}
                            intervalSeconds={10}
                         />
                    )}
                </section>

                {financeData.value && (
                    <FinanceInfo data={financeData.value} class="lg:w-[320px]" />
                )}
            </main>

            {runningTextData.value && (
                <RunningText teks={runningTextData.value} />
            )}
        </div>
    );
});

export const head: DocumentHead = {
    title: "Masjid Baiturrahim",
    meta: [
        {
            name: "description",
            content: "Masjid Baiturrahim adalah sebuah masjid yang didirikan tahun 2006 di Pondok Benda, Pamulang.",
        },
    ],
};