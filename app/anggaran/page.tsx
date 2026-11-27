"use client";

import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { bulanSekarang, rupiah } from "../lib/format";
import { KATEGORI_KELUAR } from "../lib/types";

export default function HalamanAnggaran() {
  const { siap, transaksi, anggaran, setBatas } = useFinance();
  const [kategori, setKategori] = useState(KATEGORI_KELUAR[0]);
  const [batas, setBatasInput] = useState("");

  if (!siap) return <p className="memuat">Memuat data...</p>;

  const bulan = bulanSekarang();
  const terpakai = (kat: string) =>
    transaksi
      .filter((t) => t.jenis === "keluar" && t.kategori === kat && t.tanggal.startsWith(bulan))
      .reduce((s, t) => s + t.nominal, 0);

  const totalBatas = anggaran.reduce((s, a) => s + a.batas, 0);
  const totalPakai = anggaran.reduce((s, a) => s + terpakai(a.kategori), 0);

  return (
    <>
      <div className="judul-halaman">
        <h1>Anggaran</h1>
        <span>Batas pengeluaran bulan berjalan</span>
      </div>

      <section className="grid-form">
        <div className="card">
          <div className="card-kepala">
            <h2>Atur Batas</h2>
          </div>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setBatas(kategori, Number(batas));
              setBatasInput("");
            }}
          >
            <div className="input-group">
              <span className="addon">Kategori</span>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                {KATEGORI_KELUAR.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <span className="addon">Batas</span>
              <input
                type="number"
                min="0"
                value={batas}
                onChange={(e) => setBatasInput(e.target.value)}
                placeholder="0 untuk menghapus"
              />
            </div>
            <button className="btn btn-utama" type="submit">
              Simpan Anggaran
            </button>
          </form>

          <div className="ringkas-anggaran">
            <span>Total terpakai</span>
            <strong>
              {rupiah(totalPakai)} <small>dari {rupiah(totalBatas)}</small>
            </strong>
          </div>
        </div>

        <div className="card">
          <div className="card-kepala">
            <h2>Pemakaian Anggaran</h2>
          </div>
          {anggaran.length === 0 ? (
            <p className="kosong">Belum ada anggaran yang diatur.</p>
          ) : (
            <div className="bar-list">
              {anggaran.map((a) => {
                const pakai = terpakai(a.kategori);
                const persen = Math.round((pakai / a.batas) * 100);
                const status = persen > 100 ? "lewat" : persen >= 80 ? "hampir" : "";
                return (
                  <div key={a.kategori} className="bar-item">
                    <div className="bar-label">
                      <span>{a.kategori}</span>
                      <span>
                        {rupiah(pakai)} / {rupiah(a.batas)}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className={`bar-isi ${status}`}
                        style={{ width: `${Math.min(persen, 100)}%` }}
                      />
                    </div>
                    <small className={status ? `teks-${status}` : "teks-muted"}>
                      {persen > 100
                        ? `Melebihi batas ${rupiah(pakai - a.batas)}`
                        : `${persen}% terpakai, sisa ${rupiah(a.batas - pakai)}`}
                    </small>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}