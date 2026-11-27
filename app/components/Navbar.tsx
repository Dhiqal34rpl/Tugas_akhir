"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transaksi", label: "Transaksi" },
  { href: "/anggaran", label: "Anggaran" },
  { href: "/laporan", label: "Laporan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/dashboard" className="brand">
          <span className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15V7" />
              <circle cx="16.5" cy="14" r="1" />
            </svg>
          </span>
          <span className="brand-name">Sistem Keuangan</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Buka menu"
          onClick={() => setBuka(!buka)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-menu ${buka ? "open" : ""}`}>
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setBuka(false)}
              className={pathname.startsWith(m.href) ? "active" : ""}
            >
              {m.label}
            </Link>
          ))}
          <Link href="/login_page" className="nav-keluar">
            Keluar
          </Link>
        </nav>
      </div>
    </header>
  );
}