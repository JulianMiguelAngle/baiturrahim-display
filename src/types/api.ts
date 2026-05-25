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
        jadwal: Record<string, {
            tanggal: string;
            imsak: string;
            subuh: string;
            terbit: string;
            dhuha: string;
            dzuhur: string;
            ashar: string;
            maghrib: string;
            isya: string;
        }>
    }
}