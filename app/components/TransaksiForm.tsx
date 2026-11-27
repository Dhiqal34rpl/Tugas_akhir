"use client";

import { FormEvent, useEffect, useState } from "react";
import { hariIni } from "../lib/format";
import {
  Jenis,
  KATEGORI_KELUAR,
  KATEGORI_MASUK,
  Transaksi,
} from "../lib/types";

interface Props {
  awal: Transaksi | null;
  onSimpan: (data: Omit<Transaksi, "id">, id?: string) => void;
  onBatal: () => void;
}

export default function TransaksiForm({ awal, onSimpan, onBatal }: Props) {
  const [jenis, setJenis] = useState<Jenis>("keluar");
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_KELUAR[0]);
  const [nominal, setNominal] = useState("");
  const [error, setError] = useState("");

  const daftarKategori = jenis === "masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR;

  useEffect(() => {
    if (awal) {
      setJenis(awal.jenis);
      setTanggal(awal.tanggal);
      setKeterangan(awal.keterangan);
      setKategori(awal.kategori);
      setNominal(String(awal.nominal));
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awal]);

  function reset() {
    setJenis("keluar");
    setTanggal(hariIni());
    setKeterangan("");
    setKategori(KATEGORI_KELUAR[0]);
    setNominal("");
    setError("");
  }

  function gantiJenis(j: Jenis) {
    setJenis(j);
    setKategori(j === "masuk" ? KATEGORI_MASUK[0] : KATEGORI_KELUAR[0]);
  }

  function kirim(e: FormEvent) {
    e.preventDefault();
    const angka = Number(nominal);
    if (!keterangan.trim()) return setError("Keterangan belum diisi.");
    if (!angka || angka <= 0) return setError("Nominal harus lebih dari nol.");
    onSimpan(
      { jenis, tanggal, keterangan: keterangan.trim(), kategori, nominal: angka },
      awal?.id
    );
    reset();
  }

  return (
    <form onSubmit={kirim} className="form-stack">
      <div className="input-group">
        <span className="addon">Jenis</span>
        <select value={jenis} onChange={(e) => gantiJenis(e.target.value as Jenis)}>
          <option value="keluar">Pengeluaran</option>
          <option value="masuk">Pemasukan</option>
        </select>
      </div>

      <div className="input-group">
        <span className="addon">Tanggal</span>
        <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      </div>

      <div className="input-group">
        <span className="addon">Keterangan</span>
        <input
          type="text"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="mis. Makan siang"
        />
      </div>

      <div className="input-group">
        <span className="addon">Kategori</span>
        <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
          {daftarKategori.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <span className="addon">Nominal</span>
        <input
          type="number"
          min="0"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          placeholder="0"
        />
      </div>

      {error && <p className="pesan-error">{error}</p>}

      <div className="form-aksi">
        <button type="submit" className="btn btn-utama">
          {awal ? "Simpan Perubahan" : "Tambah Transaksi"}
        </button>
        {awal && (
          <button
            type="button"
            className="btn btn-tipis"
            onClick={() => {
              reset();
              onBatal();
            }}
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}