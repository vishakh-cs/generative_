// components/PrivateRoute.js

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ProtectedRoutes = ({ children }) => {
  const { status, data: session } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    // If user is not authenticated, redirect to login
    router.replace('/');
    return null;
  }

  return children;
};

export default ProtectedRoutes;
