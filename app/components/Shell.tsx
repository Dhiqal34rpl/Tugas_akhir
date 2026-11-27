"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const polos = pathname === "/" || pathname.startsWith("/login_page");

  if (polos) return <>{children}</>;

  return (
    <div className="shell">
      <Navbar />
      <main className="container main">{children}</main>
      <Footer />
    </div>
  );
}