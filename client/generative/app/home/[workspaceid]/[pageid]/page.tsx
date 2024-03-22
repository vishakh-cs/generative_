"use client"
import React from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import CollaborativeEditor, { Editor } from '@/components/CollaborativeEditor/Editor';
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
            <div className='opacity-60 sticky top-0 z-10 '>workspaceid{params.workspaceid}/{params.pageid}</div>
            <BannerImage workspaceId={params.workspaceid} pageId={params.pageid} />
          
            
               <Editor workspaceId={params.workspaceid} pageId={params.pageid} />
              
          
          </>
        )}
      </div>
    </ProtectedRoutes>
  );
}
