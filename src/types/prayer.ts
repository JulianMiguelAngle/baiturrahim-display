
export interface PrayerSchedule {
    tanggal: string;
    imsak: string;
    subuh: string;
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export interface PrayerApiResponse {
    kabko: string;
    prov: string;
    jadwal: PrayerSchedule;
}