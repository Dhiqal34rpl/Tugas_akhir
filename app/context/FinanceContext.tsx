"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Anggaran, Transaksi } from "../lib/types";

interface FinanceState {
  siap: boolean;
  transaksi: Transaksi[];
  anggaran: Anggaran[];
  tambah: (t: Omit<Transaksi, "id">) => void;
  ubah: (t: Transaksi) => void;
  hapus: (id: string) => void;
  setBatas: (kategori: string, batas: number) => void;
}

const FinanceContext = createContext<FinanceState | null>(null);

const KEY_T = "sk_transaksi";
const KEY_A = "sk_anggaran";

const pad = (n: number) => String(n).padStart(2, "0");

function contohData(): Transaksi[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const baris: [string, string, string, "masuk" | "keluar", number][] = [
    ["01", "Gaji bulanan", "Gaji", "masuk", 5500000],
    ["02", "Bayar kos", "Tagihan", "keluar", 900000],
    ["03", "Makan siang kantin", "Makan & Minum", "keluar", 25000],
    ["04", "Bensin motor", "Transportasi", "keluar", 50000],
    ["05", "Listrik token", "Tagihan", "keluar", 150000],
    ["06", "Beli buku kuliah", "Pendidikan", "keluar", 120000],
    ["07", "Proyek desain logo", "Usaha", "masuk", 750000],
  ];
  return baris.map(([d, ket, kat, jenis, nom], i) => ({
    id: `seed-${i}`,
    tanggal: `${y}-${m}-${d}`,
    keterangan: ket,
    kategori: kat,
    jenis,
    nominal: nom,
  }));
}

const anggaranAwal: Anggaran[] = [
  { kategori: "Makan & Minum", batas: 1200000 },
  { kategori: "Transportasi", batas: 400000 },
  { kategori: "Tagihan", batas: 1200000 },
  { kategori: "Belanja", batas: 500000 },
  { kategori: "Hiburan", batas: 300000 },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [siap, setSiap] = useState(false);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [anggaran, setAnggaran] = useState<Anggaran[]>([]);

  useEffect(() => {
    try {
      const t = localStorage.getItem(KEY_T);
      const a = localStorage.getItem(KEY_A);
      setTransaksi(t ? JSON.parse(t) : contohData());
      setAnggaran(a ? JSON.parse(a) : anggaranAwal);
    } catch {
      setTransaksi(contohData());
      setAnggaran(anggaranAwal);
    }
    setSiap(true);
  }, []);

  useEffect(() => {
    if (!siap) return;
    localStorage.setItem(KEY_T, JSON.stringify(transaksi));
    localStorage.setItem(KEY_A, JSON.stringify(anggaran));
  }, [transaksi, anggaran, siap]);

  const tambah: FinanceState["tambah"] = (t) =>
    setTransaksi((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);

  const ubah: FinanceState["ubah"] = (t) =>
    setTransaksi((prev) => prev.map((x) => (x.id === t.id ? t : x)));

  const hapus: FinanceState["hapus"] = (id) =>
    setTransaksi((prev) => prev.filter((x) => x.id !== id));

  const setBatas: FinanceState["setBatas"] = (kategori, batas) =>
    setAnggaran((prev) => {
      const ada = prev.some((a) => a.kategori === kategori);
      if (batas <= 0) return prev.filter((a) => a.kategori !== kategori);
      return ada
        ? prev.map((a) => (a.kategori === kategori ? { ...a, batas } : a))
        : [...prev, { kategori, batas }];
    });

  return (
    <FinanceContext.Provider
      value={{ siap, transaksi, anggaran, tambah, ubah, hapus, setBatas }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance harus di dalam FinanceProvider");
  return ctx;
}