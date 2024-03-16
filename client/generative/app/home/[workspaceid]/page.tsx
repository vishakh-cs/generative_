"use client"
import React from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import CollaborativeEditor from '@/components/CollaborativeEditor/Editor';
import { ClientSideSuspense } from '@liveblocks/react';


export default function workspaceid({ params }) {

  const isLogoutClicked = useStore((state) => state.isLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);

  console.log('isLogoutClicked:', isLogoutClicked);

  return (
    <ProtectedRoutes>
      <div className='bg-workspaceColor min-h-screen'>
        {isLogoutClicked ? (
          <LogoutModal onClose={() => resetLogoutClicked()} />
        ) : (
          <>
            <div className='opacity-60'>workspaceid{params.workspaceid}</div>
            <BannerImage workspaceId={params.workspaceid} pageId={params.pageid} />
            <RoomProvider id="my-room" initialPresence={{}}>
              <ClientSideSuspense fallback="Loading…">
                {() => <CollaborativeEditor />}
              </ClientSideSuspense>
            </RoomProvider>
          </>
        )}
      </div>
    </ProtectedRoutes>
  );
}
