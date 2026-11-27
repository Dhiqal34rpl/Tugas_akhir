"use client";

import { useMemo, useState } from "react";
import TransaksiForm from "../components/TransaksiForm";
import { useFinance } from "../context/FinanceContext";
import { rupiah, tanggalPendek } from "../lib/format";
import { Transaksi } from "../lib/types";

export default function HalamanTransaksi() {
  const { siap, transaksi, tambah, ubah, hapus } = useFinance();
  const [edit, setEdit] = useState<Transaksi | null>(null);
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<"semua" | "masuk" | "keluar">("semua");

  const tampil = useMemo(
    () =>
      transaksi
        .filter((t) => (filter === "semua" ? true : t.jenis === filter))
        .filter((t) =>
          (t.keterangan + t.kategori).toLowerCase().includes(cari.toLowerCase())
        )
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
    [transaksi, cari, filter]
  );

  if (!siap) return <p className="memuat">Memuat data...</p>;

  function simpan(data: Omit<Transaksi, "id">, id?: string) {
    if (id) ubah({ ...data, id });
    else tambah(data);
    setEdit(null);
  }

  function konfirmasiHapus(t: Transaksi) {
    if (confirm(`Hapus transaksi "${t.keterangan}"?`)) {
      hapus(t.id);
      if (edit?.id === t.id) setEdit(null);
    }
  }

  return (
    <>
      <div className="judul-halaman">
        <h1>Transaksi</h1>
        <span>{transaksi.length} catatan tersimpan</span>
      </div>

      <section className="grid-form">
        <div className="card">
          <div className="card-kepala">
            <h2>{edit ? "Ubah Transaksi" : "Transaksi Baru"}</h2>
          </div>
          <TransaksiForm awal={edit} onSimpan={simpan} onBatal={() => setEdit(null)} />
        </div>

        <div className="card">
          <div className="card-kepala">
            <h2>Riwayat</h2>
          </div>

          <div className="toolbar">
            <input
              className="input-polos"
              placeholder="Cari keterangan atau kategori"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />
            <select
              className="input-polos"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="semua">Semua</option>
              <option value="masuk">Pemasukan</option>
              <option value="keluar">Pengeluaran</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Kategori</th>
                  <th className="kanan">Nominal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tampil.length === 0 && (
                  <tr>
                    <td colSpan={5} className="kosong">
                      Tidak ada data yang cocok.
                    </td>
                  </tr>
                )}
                {tampil.map((t) => (
                  <tr key={t.id}>
                    <td>{tanggalPendek(t.tanggal)}</td>
                    <td>{t.keterangan}</td>
                    <td>
                      <span className="badge">{t.kategori}</span>
                    </td>
                    <td className={`kanan ${t.jenis === "masuk" ? "teks-hijau" : "teks-merah"}`}>
                      {t.jenis === "masuk" ? "+" : "-"} {rupiah(t.nominal)}
                    </td>
                    <td className="aksi">
                      <button className="tautan" onClick={() => setEdit(t)}>Ubah</button>
                      <button className="tautan bahaya" onClick={() => konfirmasiHapus(t)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}