import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { Breadcrumb } from "@/components/breadcrumb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Snippets - Share and Discover Code Snippets",
  description:
    "A modern platform for developers to share and discover code snippets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Breadcrumb />
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
          <Toaster richColors closeButton position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
