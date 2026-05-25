CREATE TABLE `laporan_keuangan` (
	`id` integer PRIMARY KEY NOT NULL,
	`jumlah_infaq` integer DEFAULT 0 NOT NULL,
	`tanggal_infaq` text NOT NULL,
	`jumlah_pengeluaran` integer DEFAULT 0 NOT NULL,
	`tanggal_pengeluaran` text NOT NULL,
	`total_kas` integer DEFAULT 0 NOT NULL,
	`tanggal_kas` text NOT NULL,
	CONSTRAINT "cek_baris_tunggal_keuangan" CHECK("laporan_keuangan"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `poster_kegiatan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url_gambar` text NOT NULL,
	`nama_file` text NOT NULL,
	`dibuat_pada` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `teks_berjalan` (
	`id` integer PRIMARY KEY NOT NULL,
	`isi_teks` text NOT NULL,
	CONSTRAINT "cek_baris_tunggal" CHECK("teks_berjalan"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fullname` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);