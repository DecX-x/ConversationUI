import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat',
  description: 'zzz💀I',
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
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40">
              <div className="container mx-auto px-2 py-2 flex items-center justify-between">
                <span className="text-xl font-semibold">Chat</span>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 container mx-auto py-2 px-2">
              {children}
            </main>
            <footer className="py-2 px-2 text-center text-sm text-muted-foreground border-t border-border/40">
              <div className="container mx-auto">
                &copy; {new Date().getFullYear()} Illumina. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}