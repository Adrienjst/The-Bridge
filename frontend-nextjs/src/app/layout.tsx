import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "StructLab – Apprendre la Structuration de Produits",
  description: "Application interactive pour maîtriser la structuration de produits structurés equity exotiques : cours, flashcards, quiz, exercices et visualisations 2D/3D.",
  keywords: ["structuration", "produits structurés", "equity derivatives", "autocall", "finance", "options"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
