import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collectiico",
  description: "Coleta inteligente de recicláveis",
  // Garante que o site escale corretamente no celular (evita zoom indesejado)
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        {/* AuthProvider envolve toda a aplicação para sessão funcionar no Header */}
        <AuthProvider>
          
          <Header />
          
          {/* Notificações configuradas */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                fontSize: '14px', // Ajuste para leitura mobile
              },
              success: {
                style: {
                  background: 'green',
                },
              },
              error: {
                style: {
                  background: 'red',
                },
              },
            }} 
          />

          {/* flex-1 garante que o conteúdo ocupe o espaço disponível, empurrando o footer para baixo */}
          <main className="flex-1 w-full">
             {children}
          </main>

          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}