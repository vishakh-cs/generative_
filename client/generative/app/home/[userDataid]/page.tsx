"use client"
import React, { useEffect, useState } from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import LandingWorkspace from '@/components/LandingWorkspace/page';
import { CollabAlertBox } from '@/components/CollabAlertBox/page';
import { useRouter } from 'next/navigation';
import Loaders from '@/components/Loaders/page';


export default function workspaceid({ params }) {

  const isLogoutClicked = useStore((state) => state.isLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);
  const userEmail = localStorage.getItem('userEmail');
  const [loading, setLoading] = useState(true);

 

  if (loading) {
    return <Loaders />
  }

  return (
    <ProtectedRoutes UserEmail={userData}>
      <div className='bg-workspaceColor min-h-screen'>
        {isLogoutClicked ? (
          <LogoutModal onClose={() => resetLogoutClicked()} />
        ) : (
          <>
            <div className='opacity-60'>workspaceid{params.workspaceid}
             <LandingWorkspace />
             {/* <CollabAlertBox /> */}
            </div>
           

          </>
        )}
      </div>
    </ProtectedRoutes>
  );
}
