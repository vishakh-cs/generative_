// components/PrivateRoute.js

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

  if (!session  && !isLoggedIn) {
    // If user is not authenticated, redirect to login
    router.replace('/');
    return null;
  }

  return children;
};

export default ProtectedRoutes;
