"use client";

import Link from "next/link";
import StatCard from "../components/StatCard";
import { useFinance } from "../context/FinanceContext";
import { bulanSekarang, NAMA_BULAN, rupiah, tanggalPendek } from "../lib/format";

export default function Dashboard() {
  const { siap, transaksi } = useFinance();
  if (!siap) return <p className="memuat">Memuat data...</p>;

  const bulan = bulanSekarang();
  const bulanIni = transaksi.filter((t) => t.tanggal.startsWith(bulan));

  const masuk = bulanIni.filter((t) => t.jenis === "masuk").reduce((s, t) => s + t.nominal, 0);
  const keluar = bulanIni.filter((t) => t.jenis === "keluar").reduce((s, t) => s + t.nominal, 0);
  const saldo = transaksi.reduce(
    (s, t) => s + (t.jenis === "masuk" ? t.nominal : -t.nominal),
    0
  );
  const rasio = masuk > 0 ? Math.round(((masuk - keluar) / masuk) * 100) : 0;

  const perKategori = Object.entries(
    bulanIni
      .filter((t) => t.jenis === "keluar")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.kategori] = (acc[t.kategori] ?? 0) + t.nominal;
        return acc;
      }, {})
  ).sort((a, b) => b[1] - a[1]);

  const terbaru = [...transaksi]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 6);

  const [thn, bln] = bulan.split("-").map(Number);

  return (
    <>
      <div className="judul-halaman">
        <h1>Dashboard</h1>
        <span>
          Ringkasan {NAMA_BULAN[bln - 1]} {thn}
        </span>
      </div>

      <section className="grid-stat">
        <StatCard judul="Saldo Total" nilai={rupiah(saldo)} catatan="Semua transaksi" />
        <StatCard judul="Pemasukan" nilai={rupiah(masuk)} catatan="Bulan ini" warna="hijau" />
        <StatCard judul="Pengeluaran" nilai={rupiah(keluar)} catatan="Bulan ini" warna="merah" />
        <StatCard
          judul="Sisa Pemasukan"
          nilai={`${rasio}%`}
          catatan={masuk > 0 ? "Dari total pemasukan" : "Belum ada pemasukan"}
          warna="abu"
        />
      </section>

      <section className="grid-dua">
        <div className="card">
          <div className="card-kepala">
            <h2>Transaksi Terbaru</h2>
            <Link href="/transaksi" className="tautan">Lihat semua</Link>
          </div>
          {terbaru.length === 0 ? (
            <p className="kosong">Belum ada transaksi.</p>
          ) : (
            <ul className="daftar-transaksi">
              {terbaru.map((t) => (
                <li key={t.id}>
                  <div>
                    <strong>{t.keterangan}</strong>
                    <small>
                      {t.kategori} · {tanggalPendek(t.tanggal)}
                    </small>
                  </div>
                  <span className={t.jenis === "masuk" ? "teks-hijau" : "teks-merah"}>
                    {t.jenis === "masuk" ? "+" : "-"} {rupiah(t.nominal)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-kepala">
            <h2>Pengeluaran per Kategori</h2>
          </div>
          {perKategori.length === 0 ? (
            <p className="kosong">Belum ada pengeluaran bulan ini.</p>
          ) : (
            <div className="bar-list">
              {perKategori.map(([kat, nom]) => (
                <div key={kat} className="bar-item">
                  <div className="bar-label">
                    <span>{kat}</span>
                    <span>{rupiah(nom)}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-isi"
                      style={{ width: `${(nom / perKategori[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}