"use client"
import React, { useEffect } from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import CollaborativeEditor, { Editor } from '@/components/CollaborativeEditor/Editor';
import { ClientSideSuspense } from '@liveblocks/react';
import ProfileIcon from '@/components/ProfileIcon/page';
import Publish from '@/components/Publish/page';


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
            <div className='flex justify-between items-center  py-2 px-4 sticky top-0 z-10'>
              <div> 
                <span className='text-sm'>workspaceid{params.workspaceid}/{params.pageid}</span>
              </div>
              <div className='flex items-center gap-4 mr-4'> 
                
                <ProfileIcon workspaceId={params.workspaceid} pageId={params.pageid} />
                <Publish workspaceid={params.workspaceid} pageId={params.pageid}/>
              </div>
            </div>
            <BannerImage workspaceId={params.workspaceid} pageId={params.pageid} />
          
            
               <Editor workspaceId={params.workspaceid} pageId={params.pageid} />
              
          
          </>
        )}
      </div>
    </ProtectedRoutes>
  );
}
