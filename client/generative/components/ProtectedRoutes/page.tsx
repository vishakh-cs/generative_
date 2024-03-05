// components/PrivateRoute.js
"use client"
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { parseCookies } from 'nookies';

const ProtectedRoutes = ({ children }) => {
  const { status, data: session } = useSession();
  const cookies = parseCookies();
  const isLoggedIn = !!cookies.token;
  const router = useRouter();

  if (status === 'loading') {
    return null; 
  }

  if (status === 'authenticated' || isLoggedIn) {
    return children;
  }
  router.replace('/');
  return null;
};

export default ProtectedRoutes;
