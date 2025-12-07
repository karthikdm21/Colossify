import type { Metadata } from "next";
import "./globals.css";
import { Modal } from "@/components/ui/Modal";

export const metadata: Metadata = {
  title: "Colossify - Incubation Platform",
  description: "Transform your startup ideas into reality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Modal />
      </body>
    </html>
  );
}
