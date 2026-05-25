import { sqliteTable, text, integer, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const usersTable = sqliteTable('users_table', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    fullname: text('fullname').notNull(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
});

export const teksBerjalanTable = sqliteTable('teks_berjalan', {
    id: integer('id').primaryKey(), 
    isi_teks: text('isi_teks').notNull()
}, (table) => [
    check('cek_baris_tunggal', sql`${table.id} = 1`),
]);

export const laporanKeuanganTable = sqliteTable('laporan_keuangan', {
    id: integer('id').primaryKey(),
    // SQLite tidak memiliki bigint, gunakan integer dengan mode: 'number'
    jumlah_infaq: integer('jumlah_infaq', { mode: 'number' }).notNull().default(0),
    tanggal_infaq: text('tanggal_infaq').notNull(),
    
    jumlah_pengeluaran: integer('jumlah_pengeluaran', { mode: 'number' }).notNull().default(0),
    tanggal_pengeluaran: text('tanggal_pengeluaran').notNull(),
    
    total_kas: integer('total_kas', { mode: 'number' }).notNull().default(0),
    tanggal_kas: text('tanggal_kas').notNull(),
}, (table) => [
    check('cek_baris_tunggal_keuangan', sql`${table.id} = 1`),
]);

export const posterKegiatanTable = sqliteTable('poster_kegiatan', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    url_gambar: text('url_gambar').notNull(),
    nama_file: text('nama_file').notNull(),
    // SQLite menangani waktu menggunakan unixepoch yang dipetakan sebagai timestamp
    dibuat_pada: integer('dibuat_pada', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});