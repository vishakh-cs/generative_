"use client"
import React from 'react';
import { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar/page';


const inter = Inter({ subsets: ['latin'] });

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const  pathname = usePathname();

  const isAdminDashboard = pathname.startsWith('/Admin/adminDashboard/');

  return (
    <html lang="en">
      <body className={inter.className}>
        {isAdminDashboard ? <Sidebar /> : null}
        {children}
      </body>
    </html>
  );
}
