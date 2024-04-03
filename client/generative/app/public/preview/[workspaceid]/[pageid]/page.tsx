"use client"
import React, { useEffect, useState } from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import { Editor } from '@/components/CollaborativeEditor/Editor';
import { ClientSideSuspense } from '@liveblocks/react';
import ProfileIcon from '@/components/ProfileIcon/page';
import Publish from '@/components/Publish/page';
import axios from 'axios';
import {  EditorComponentPreview } from '@/components/Publish/EditorComponent';
import BannerImagePreview from '@/components/Publish/BannerImagePreview';


export default function workspaceid({ params }) {

  const [workspaceName, setWorkspaceName] = useState('');
  const isLogoutClicked = useStore((state) => state.isLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);

  console.log('isLogoutClicked:', isLogoutClicked);


  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get_publish_data?workspaceid=${params.workspaceid}`);
        if (response.status === 200) {
          const data = response.data;
          console.log("data", data);
          setWorkspaceName(data.workspace);
        } else {
          console.error('Failed to fetch workspace data');
        }
      } catch (error) {
        console.error('Error fetching workspace data:', error);
      }
    };

    fetchWorkspaceData();
  }, [params.workspaceid]);


  return (

    <div className='bg-workspaceColor min-h-screen'>
      {isLogoutClicked ? (
        <LogoutModal onClose={() => resetLogoutClicked()} />
      ) : (
        <>
          <div className='flex justify-between items-center  py-2 px-4 sticky top-0 z-10'>
            <div>
              <span className='text-lg font-semibold text-gray-800 dark:text-slate-400'>
                Workspace: <span className="text-white">{workspaceName.name}</span>
              </span>

            </div>
            <div className='flex items-center gap-4 mr-4'>

            </div>
          </div>
          <BannerImagePreview workspaceId={params.workspaceid} pageId={params.pageid} />


          <EditorComponentPreview editable={false} workspaceId={params.workspaceid} pageId={params.pageid} />


        </>
      )}
    </div>

  );
}
