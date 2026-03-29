import type { Metadata } from 'next';
import './globals.css'; // Global styles
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/components/ui/AuthProvider';
import { CartProvider } from '@/components/ui/CartProvider';
import { WishlistProvider } from '@/components/ui/WishlistProvider';

export const metadata: Metadata = {
  title: 'Scalazon - An Amazon Clone',
  description: 'Scalazon - An Amazon Clone',
  icons: {
    icon: '/Favicon.png',
    apple: '/Favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
