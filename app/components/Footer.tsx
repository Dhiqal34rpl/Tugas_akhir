"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [tahun, setTahun] = useState("");

  useEffect(() => {
    setTahun(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h4>Sistem Keuangan</h4>
          <p>
            Catat pemasukan dan pengeluaran harian, atur batas anggaran, dan
            pantau kondisi keuanganmu tiap bulan.
          </p>
        </div>
        <div>
          <h4>Menu</h4>
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/transaksi">Transaksi</Link></li>
            <li><Link href="/anggaran">Anggaran</Link></li>
            <li><Link href="/laporan">Laporan</Link></li>
          </ul>
        </div>
        <div>
          <h4>Catatan</h4>
          <p>
            Data tersimpan di browser perangkat ini. Unduh laporan CSV secara
            berkala sebagai cadangan.
          </p>
        </div>
      </div>
      <div className="footer-bawah">
        <div className="container">
          © {tahun} Sistem Keuangan · Tugas Akhir
        </div>
      </div>
    </footer>
  );
}