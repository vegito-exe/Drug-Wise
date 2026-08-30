import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrugWise",
  description:
    "Plateforme d'éducation pharmaceutique bilingue pour les étudiants en pharmacie.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
