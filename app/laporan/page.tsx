"use client";

import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { useFinance } from "../context/FinanceContext";
import { NAMA_BULAN, rupiah } from "../lib/format";

export default function HalamanLaporan() {
  const { siap, transaksi } = useFinance();
  const [tahunIni, setTahunIni] = useState<number | null>(null);
  const [tahun, setTahun] = useState(0);

  useEffect(() => {
    const t = new Date().getFullYear();
    setTahunIni(t);
    setTahun(t);
  }, []);

  if (!siap || tahunIni === null) return <p className="memuat">Memuat data...</p>;

  const rekap = NAMA_BULAN.map((nama, i) => {
    const prefix = `${tahun}-${String(i + 1).padStart(2, "0")}`;
    const data = transaksi.filter((t) => t.tanggal.startsWith(prefix));
    const masuk = data.filter((t) => t.jenis === "masuk").reduce((s, t) => s + t.nominal, 0);
    const keluar = data.filter((t) => t.jenis === "keluar").reduce((s, t) => s + t.nominal, 0);
    return { nama, masuk, keluar, selisih: masuk - keluar };
  });

  const totalMasuk = rekap.reduce((s, r) => s + r.masuk, 0);
  const totalKeluar = rekap.reduce((s, r) => s + r.keluar, 0);
  const tertinggi = Math.max(...rekap.flatMap((r) => [r.masuk, r.keluar]), 1);

  function unduhCsv() {
    const baris = [
      "Tanggal,Keterangan,Kategori,Jenis,Nominal",
      ...transaksi
        .filter((t) => t.tanggal.startsWith(String(tahun)))
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
        .map(
          (t) =>
            `${t.tanggal},"${t.keterangan.replace(/"/g, '""')}",${t.kategori},${t.jenis},${t.nominal}`
        ),
    ];
    const blob = new Blob([baris.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-keuangan-${tahun}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="judul-halaman">
        <h1>Laporan</h1>
        <div className="aksi-kepala">
          <select
            className="input-polos"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
          >
            {[0, 1, 2].map((n) => (
              <option key={n} value={tahunIni - n}>
                {tahunIni - n}
              </option>
            ))}
          </select>
          <button className="btn btn-utama btn-kecil" onClick={unduhCsv}>
            Unduh CSV
          </button>
        </div>
      </div>

      <section className="grid-stat tiga">
        <StatCard judul={`Pemasukan ${tahun}`} nilai={rupiah(totalMasuk)} warna="hijau" />
        <StatCard judul={`Pengeluaran ${tahun}`} nilai={rupiah(totalKeluar)} warna="merah" />
        <StatCard judul="Selisih" nilai={rupiah(totalMasuk - totalKeluar)} />
      </section>

      <div className="card">
        <div className="card-kepala">
          <h2>Grafik Bulanan</h2>
          <div className="legenda">
            <span><i className="kotak hijau" /> Pemasukan</span>
            <span><i className="kotak merah" /> Pengeluaran</span>
          </div>
        </div>
        <div className="chart">
          {rekap.map((r) => (
            <div key={r.nama} className="chart-kolom">
              <div className="chart-batang">
                <div className="b hijau" style={{ height: `${(r.masuk / tertinggi) * 100}%` }} title={rupiah(r.masuk)} />
                <div className="b merah" style={{ height: `${(r.keluar / tertinggi) * 100}%` }} title={rupiah(r.keluar)} />
              </div>
              <span>{r.nama.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-kepala">
          <h2>Rekap per Bulan</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bulan</th>
                <th className="kanan">Pemasukan</th>
                <th className="kanan">Pengeluaran</th>
                <th className="kanan">Selisih</th>
              </tr>
            </thead>
            <tbody>
              {rekap.map((r) => (
                <tr key={r.nama}>
                  <td>{r.nama}</td>
                  <td className="kanan">{rupiah(r.masuk)}</td>
                  <td className="kanan">{rupiah(r.keluar)}</td>
                  <td className={`kanan ${r.selisih < 0 ? "teks-merah" : ""}`}>{rupiah(r.selisih)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}