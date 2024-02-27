"use client"
import React, { useState, useEffect } from 'react';
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check user's dark mode preference from localStorage or other sources
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';

    // Set dark mode based on user preference or stored preference
    setDarkMode(userPrefersDark || storedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const pathname = usePathname();
  return (
    <html lang="en">
      <body className={`${inter.className} ${darkMode ? 'dark' : ''}`}>
        <NextAuthProvider>
          {!pathname.includes('/Admin') && pathname !== '/login' && pathname !== '/signup' ? (
            <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          ) : null}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
