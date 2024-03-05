"use client"
import React from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';

export default function workspaceid({params}) {

  const isLogoutClicked = useStore((state) => state.isLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);

  console.log('isLogoutClicked:', isLogoutClicked);
  return (
    <ProtectedRoutes >
    <div className='bg-workspaceColor h-screen'>
      {isLogoutClicked ? (
        <LogoutModal  onClose={() => resetLogoutClicked()} />
      ) : (
        <>
          <div>workspaceid{params.workspaceid}</div>
         
        </>
      )}
    </div>
    </ProtectedRoutes>
  );
}
