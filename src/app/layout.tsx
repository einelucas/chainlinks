import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "ChainLinks — Um único link. Totalmente seu.",
  description:
    "Crie uma página de links personalizada em minutos. Escolha cores, fontes e efeitos pelo editor visual, sem precisar programar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
