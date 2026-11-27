export type Jenis = "masuk" | "keluar";

export interface Transaksi {
  id: string;
  tanggal: string; // format YYYY-MM-DD
  keterangan: string;
  kategori: string;
  jenis: Jenis;
  nominal: number;
}

export interface Anggaran {
  kategori: string;
  batas: number;
}

export const KATEGORI_MASUK = ["Gaji", "Usaha", "Bonus", "Lainnya"];

export const KATEGORI_KELUAR = [
  "Makan & Minum",
  "Transportasi",
  "Tagihan",
  "Belanja",
  "Pendidikan",
  "Kesehatan",
  "Hiburan",
  "Lainnya",
];