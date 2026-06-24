import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./_components/Toast";

export const metadata: Metadata = {
  title: "Preorder Manager",
  description: "Manage preorders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
