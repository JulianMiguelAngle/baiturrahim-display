import { PrayerSchedule } from "./prayer";

export type RunningText = {
    id: number;
    isi_teks: string;
}

export type Finance = {
    label: string;
    nominal: number;
    tanggal: string;
}[]

export type Poster = {
    id: number;
    url_gambar: string;
    nama_file: string;
    dibuat_pada: Date | null;
}[]

export type Calendar = {
    status: boolean;
    message: string;
    data: {
        method: string;
        adjustment: number;
        ce: {
            today: string;
            day: number;
            dayName: string;
            month: number;
            monthName: string;
            year: number;
        },
        hijr: {
            today: string;
            day: number;
            dayName: string;
            month: number;
            monthName: string;
            year: number;
        }
    }
}

export type Prayer = {
    status: boolean;
    message: string;
    data: {
        id: string;
        kabko: string;
        prov: string;
        jadwal: Record<string, PrayerSchedule>
    }
}

export const fallbackCalendar = {
    status: true,
    message: "success",
    data: {
        method: "standar",
        adjustment: 0,
        ce: {
            today: "Selasa, 26 Mei 2026",
            day: 26,
            dayName: "Selasa",
            month: 5,
            monthName: "Mei",
            year: 2026
        },
        hijr: {
            today: "Selasa, 10 Zulhijah 1447 H",
            day: 10,
            dayName: "Selasa",
            month: 12,
            monthName: "Zulhijah",
            year: 1447
        }
    }
}

export const fallbackPrayerHour = {
    status: true,
    message: "success",
    data: {
        id: "82aa4b0af34c2313a562076992e50aa3",
        kabko: "KOTA TANGERANG SELATAN",
        prov: "BANTEN",
        jadwal: {
            "2026-05-26": {
                tanggal: "Selasa, 26/05/2026",
                imsak: "04:26",
                subuh: "04:36",
                terbit: "05:53",
                dhuha: "06:22",
                dzuhur: "11:54",
                ashar: "15:15",
                maghrib: "17:47",
                isya: "19:00"
            }
        }
    }
}