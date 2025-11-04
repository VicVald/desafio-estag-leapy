import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lista de Talentos - Leapy",
  description: "Gerencie e visualize todos os talentos da plataforma com filtros avançados e paginação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-content px-4 py-2 rounded z-50"
        >
          Pular para conteúdo principal
        </a>

        {/* Main Content */}
        <main id="main-content" className="flex-1">
          <Suspense fallback={
            <div className="min-h-screen bg-base-200">
              {/* Hero Section Skeleton */}
              <div className="max-w-md mx-auto text-center mb-8">
                <div className="skeleton h-12 w-80 mx-auto mb-4"></div>
              </div>

              <div className="container mx-auto p-6">
                {/* Filters Skeleton */}
                <div className="card bg-base-100 shadow-xl mb-6">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                      <div className="skeleton h-6 w-16"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="form-control">
                          <div className="skeleton h-4 w-24 mb-2"></div>
                          <div className="skeleton h-12 w-full"></div>
                        </div>
                      ))}
                    </div>
                    <div className="skeleton h-10 w-32 mt-4"></div>
                  </div>
                </div>

                {/* Sort Skeleton */}
                <div className="flex justify-start mb-6">
                  <div className="form-control">
                    <div className="skeleton h-4 w-20 mb-2"></div>
                    <div className="skeleton h-12 w-64"></div>
                  </div>
                </div>

                {/* Stats Skeleton */}
                <div className="flex justify-between items-center mb-6">
                  <div className="skeleton h-4 w-40"></div>
                  <div className="flex gap-2">
                    <div className="skeleton h-8 w-16"></div>
                    <div className="skeleton h-8 w-16"></div>
                  </div>
                </div>

                {/* Content Skeleton - Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <div className="flex items-center gap-3">
                          <div className="skeleton h-6 w-32"></div>
                          <div className="skeleton h-5 w-16"></div>
                        </div>
                        <div className="divider"></div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="skeleton h-4 w-16"></div>
                            <div className="skeleton h-4 w-24"></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="skeleton h-4 w-20"></div>
                            <div className="skeleton h-4 w-20"></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="skeleton h-4 w-18"></div>
                            <div className="skeleton h-5 w-12"></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="skeleton h-4 w-14"></div>
                            <div className="skeleton h-4 w-20"></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="skeleton h-4 w-16"></div>
                            <div className="skeleton h-4 w-22"></div>
                          </div>
                        </div>
                        <div className="divider"></div>
                        <div className="text-xs">
                          <div className="skeleton h-3 w-32 mb-1"></div>
                          <div className="skeleton h-3 w-28 mb-1"></div>
                          <div className="skeleton h-3 w-36"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="footer footer-center bg-base-200 text-base-content p-4">
          <aside>
            <p className="text-sm">
              © 2025 Leapy - Plataforma de Gestão de Talentos
            </p>
            <p className="text-xs opacity-75">
              Desenvolvido com ❤️ para gerenciar e acompanhar o desenvolvimento de talentos
            </p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
