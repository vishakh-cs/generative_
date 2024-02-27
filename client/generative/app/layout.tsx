"use client"
import React from 'react';
import Navbar from '@/components/Navbar/page';
import { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './provider';

const inter = Inter({ subsets: ['latin'] });

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const  pathname = usePathname();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
        {
         (!pathname.includes('/Admin') && pathname !== '/login' && pathname !== '/signup') ?
          <Navbar />
          : null
        }
        
        {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
