import type { Metadata } from "next";
import "./globals.css";
import { FinanceProvider } from "./context/FinanceContext";
import Shell from "./components/Shell";

export const metadata: Metadata = {
  title: "Sistem Keuangan",
  description: "Aplikasi pencatatan dan pengelolaan keuangan pribadi",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <FinanceProvider>
          <Shell>{children}</Shell>
        </FinanceProvider>
      </body>
    </html>
  );
}