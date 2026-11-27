"use client";

import "./login.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const USER_BENAR = "admin";
const PASS_BENAR = "admin123";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lihat, setLihat] = useState(false);
  const [error, setError] = useState("");

  function masuk(e: FormEvent) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    if (username !== USER_BENAR || password !== PASS_BENAR) {
      setError("Username atau password salah.");
      return;
    }

    setError("");
    router.push("/dashboard");
  }

  return (
    <div className="lg-page">
      <form className="lg-card" onSubmit={masuk}>
        <div className="lg-logo">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15V7" />
            <circle cx="16.5" cy="14" r="1" />
          </svg>
        </div>

        <h1 className="lg-title">SISTEM KEUANGAN</h1>

        <div className="lg-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ borderRadius: "0 6px 6px 0" }}
          />
        </div>

        <div className="lg-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={lihat ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="lg-eye"
            aria-label="Tampilkan password"
            onClick={() => setLihat(!lihat)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {error && <p className="lg-error">{error}</p>}

        <button type="submit" className="lg-btn">LOGIN</button>
      </form>
    </div>
  );
}