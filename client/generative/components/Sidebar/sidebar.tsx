//Sidebar/sidebar.tsx
"use client"
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiOutlineLogout } from "react-icons/hi";
import useStore from '@/Stores/store';
import { IoMdAdd } from "react-icons/io";
import PageNameModal from './PageNameModal';
import { CiFileOn } from "react-icons/ci";
import ProfileSlider from './ProfileSlider/page';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineSettingsSuggest } from "react-icons/md";
import Settings from './Settings';
import './sidebar.css';
import { SettingsSlider } from './SettingsSlider/page';
import { FaRegTrashAlt } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import dynamic from 'next/dynamic';

const DynamicTrashBar = dynamic(() => import('./TrashBar/page'), { ssr: false });

interface SidebarContextProps {
  expanded: boolean;
}

interface SidebarProps {
  children: ReactNode;
  params: any;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export default function Sidebar({ children, params }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [collabWorkspaces, setCollabWorkspaces] = useState<any[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [Page_id, setPage_id] = useState<string[] | null>(null!);
  const [PageData, setPageData] = useState<string[] | null>(null!);
  const [selectedPage, setSelectedPage] = useState<null | string>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [workspaceid, setWorkspaceId] = useState('');
  const [loading, setLoading] = useState(false);


  const setIsLogoutClicked = useStore((state) => state.setLogoutClicked);
  const workspaceName = useStore((state) => state.workspaceName);
  const isPageRestored = useStore((state) => state.isPageRestored);
  const isWorkspaceNameChanged = useStore((state) => state.isWorkspaceNameChanged)

  const [isProfileChange, setIsProfileChange] = useState(false);

  console.log("collabWorkspaces,collaboratorWorkspaceLogo", collabWorkspaces);

  console.log("isProfileChange", isProfileChange);

  const router = useRouter();

  const toggleSidebar = () => {
    setExpanded((curr) => !curr);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addNewPage = () => {
    openModal();
  };



  // fetch user and workspace data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (!params.workspaceid) {
        return;
      }

      const response = await axios.post('http://localhost:8000/sidebar_data', {
        workspaceId: params.workspaceid,
      });

      const { data, workspaces, pages: pageIds, pageNames, pageId, collaboratorWorkspace: collabWs } = response.data;

      setPage_id(pageId)
      setPages(pageNames)
      setWorkspaceId(params.workspaceid)
      setUserData(data);
      setWorkspaces(workspaces);
      setCollabWorkspaces(collabWs);
      const selectedWorkspace = workspaces.find(w => w.id === params.workspaceid);

    } catch (error: any) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [params.workspaceId, isPageRestored, isWorkspaceNameChanged, isProfileChange]);


  const createNewWorkspace = async () => {
    try {
      console.log('Creating a new workspace...');
    } catch (error: any) {
      console.error('Error creating new workspace:', error.message);
    }
  };

  const handleLogout = () => {
    setIsLogoutClicked(true);
  };

  // page click
  const handleProfileClick = (pageId: string) => {
    if (Page_id) {
      router.replace(`/home/${params.workspaceid}/${pageId}`);
      setSelectedPage(pageId);
    } else {
      console.error('Invalid pageId:', pageId);
    }
  };


  const handleModalSubmit = async (pageName: string) => {
    try {
      const newPage = pageName.trim() || `Page ${pages.length + 1}`;
      setPages((prevPages) => [...prevPages, newPage]);

      console.log(`Added a new page: ${newPage}`);

      const response = await axios.post('http://localhost:8000/add_page', {
        workspaceId: params.workspaceid,
        pageName: newPage,
        pageContent: '',
      });

      const { pageId } = response.data;

      // Update Page_id state with the new pageId
      setPage_id((prevPageIds) => [...(prevPageIds || []), pageId]);

      toast.success(`Page "${newPage}" created successfully!`);
      fetchData();

      closeModal();
    } catch (error) {
      console.error('Error updating workspace with new page:', (error as Error).message);
      toast.error('Error creating new page');
    }
  };

  const moveToTrash = async (page: string) => {
    try {
      const response = await axios.post('http://localhost:8000/add_to_trash', {
        selectedPage,
      });
      setPages(prevPages => prevPages.filter(p => p !== page));

      setPage_id(prevPageIds => prevPageIds.filter(id => id !== selectedPage));
      toast.success('Page moved to trash successfully.');
      // Check if there are no more pages
      if (pages.length === 0) {

        router.replace(`/home/${params.workspaceid}`);
        setSelectedPage(null);
      } else {
        // Switch to the next or previous page
        const currentIndex = pages.findIndex(p => p === page);
        if (currentIndex !== -1) {
          const nextIndex = currentIndex + 1;
          const prevIndex = currentIndex - 1;
          if (nextIndex < pages.length) {
            router.replace(`/home/${params.workspaceid}/${Page_id[nextIndex]}`);
            setSelectedPage(Page_id[nextIndex]);
          } else if (prevIndex >= 0) {
            router.replace(`/home/${params.workspaceid}/${Page_id[prevIndex]}`);
            setSelectedPage(Page_id[prevIndex]);
          }
        }
      }
    } catch (error) {
      console.error('Error moving page to trash:', error);
      toast.error('Failed to move page to trash.');
    }
  };

  const expandedSidebarClass = 'w-32';
  const collapsedSidebarClass = 'w-0';
  const transitionClass = 'transition-all duration-300 ease-in-out';
  const buttonBaseClass = 'border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700';
  const selectedPageClass = 'bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white';



  const imgPaths = [
    "/Assets/workspace1.jpg",
    "/Assets/workspace2.jpg",
    "/Assets/workspace3.jpg",
    "/Assets/workspace4.jpg",
    "/Assets/briefcase_439354.png",
    "/Assets/workspace5.webp",
    "/Assets/workspace6.png",
    "/Assets/workspace7.webp",
    "/Assets/workspace8.png",
    "/Assets/workspace9.webp",
    "/Assets/workspace10.png",
    "/Assets/workspace11.png",
    "/Assets/workspace12.png",
    "/Assets/workspace13.jpg",
    "/Assets/workspace14.png",
  ];


  return (
    <aside className={twMerge('h-screen')}>
      <nav className={twMerge('h-full flex flex-col bg-white dark:bg-sidebar border-r shadow-sm')}>
        <div className={twMerge('p-4 pb-2 flex justify-between items-center')}>
          <Image
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            src="/Assets/White logo - no background.png"
            alt="logo"
            width={400}
            height={500}
          />
          <button
            onClick={toggleSidebar}
            className={twMerge('p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600')}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        {expanded && (
          <>
            <button
              onClick={createNewWorkspace}
              className={twMerge('border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700')}
            >
              <span className={twMerge('text-gray-600 dark:text-gray-300')}>Create New Workspace +</span>
            </button>

            <DynamicTrashBar workspaceId={workspaceid} />

            {/* Render regular workspaces */}
            {workspaces.map((workspace, index) => (
              <button
                key={workspace.id}
                onClick={() => console.log(`Switch to workspace: ${workspace.name}`)}
                className={twMerge('border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700')}
              >
                {workspace.workspaceLogoIndex != null && (
                  <Image
                    src={imgPaths[workspace.workspaceLogoIndex]}
                    alt={`Workspace Logo ${index}`}
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                )}
                <span className={twMerge('flex justify-between items-center w-full')}>
                  <span className={twMerge('text-gray-600 dark:text-gray-300 ml-4')}>
                    {workspace.name}
                  </span>
                  <span className='flex justify-between'>
                    <SettingsSlider workspaceId={workspaceid} workspaceName={workspace.name}
                      workspaceLogoIndex={workspace.workspaceLogoIndex}
                      workspaceType={workspace.type} />

                    <IoMdAdd
                      onClick={addNewPage}
                      size={16}
                      className='ml-4 mt-1' />
                  </span>
                </span>
              </button>
            ))}

            <div className="sidebar-content overflow-y-auto max-h-96">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="spinner-border text-indigo-500"></div>
                </div>
              ) : (
                <>
                  {/* Render workspace pages */}
                  {pages && pages.map((page, pageIndex) => (
                    <button
                      key={pageIndex}
                      className={twMerge(`
                      ${buttonBaseClass}
                      ${transitionClass}
                      ${Page_id !== null && selectedPage === Page_id[pageIndex] ? selectedPageClass : ''}
                    `)}
                      onClick={() => Page_id && handleProfileClick(Page_id[pageIndex])}
                    >
                      <CiFileOn size={20} className="ml-3" />
                      <span className={twMerge('text-gray-600 dark:text-gray-300 ml-7')}>
                        {page}
                      </span>
                      <FaRegTrashAlt size={20} className="opacity-60 ml-auto" onClick={() => moveToTrash(page)} />
                    </button>
                  ))}

                  {/* Render collaborative workspace if available */}
                  {collabWorkspaces?.pages?.length > 0 && ( 
                    <div className="collaborator-pages">
                      {/* Collab workspace header */}
                      <h3 className="flex justify-center text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text mt-4 ml-4">Collaborator Workspace</h3>
                      {/* Collab workspace details */}
                      <div className="ml-4 px-1 mb-2 flex items-center">
                        {collabWorkspaces.collablogo && (
                          <Image
                            src={imgPaths[collabWorkspaces.collablogo]}
                            alt="Collaborator Workspace Logo"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                        )}
                        <span>{collabWorkspaces.name}</span>
                      </div>
                      {/* Collab workspace pages */}
                      {collabWorkspaces.pages.map((collabPage, index) => (
                        <button
                          key={collabPage._id}
                          className={twMerge(`
                          ${buttonBaseClass}
                          ${transitionClass}
                          ${selectedPage === collabPage._id ? selectedPageClass : ''}
                        `)}
                          onClick={() => handleProfileClick(collabPage._id)}
                        >
                          <CiFileOn size={20} className="ml-3" />
                          <span className={twMerge('text-gray-600 dark:text-gray-300 ml-7')}>
                            {collabPage.PageName}
                          </span>
                          {/* Include trash functionality for pages */}
                          <FaRegTrashAlt size={20} className="opacity-60 ml-auto" onClick={() => moveToTrash(collabPage.PageName)} />
                        </button>
                      ))}

                      {/* Leave collaboration button */}
                      <button className="flex text-transparent text-center justify-center bg-clip-text bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-lg mt-6 p-8 ml-6 border-none focus:outline-none">
                        <span>Leave Collaboration</span>
                      </button>
                    </div>
                  )}

                  <div className="h-20 sticky inset-x-0 bottom-0  bg-gradient-to-t from-sidebar to-transparent"></div>
                </>
              )}
            </div>

            {isModalOpen && (
              <PageNameModal
                onClose={closeModal}
                onSubmit={handleModalSubmit}
              />
            )}
          </>
        )}

        <SidebarContext.Provider value={{ expanded }}>
          <ul className={twMerge('flex-1 px-3 dark:text-white')}>{children}</ul>
        </SidebarContext.Provider>

        <div className={twMerge('border-t flex p-3')}>
          <ProfileSlider avatarData={userData} setIsProfileChange={setIsProfileChange}
            isProfileChange={isProfileChange} />

          <div
            className={twMerge(`
               flex justify-between items-center
               overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
           `)}
          >
            <div className={twMerge('leading-4')}>
              <h4 className={twMerge('font-semibold')}>{userData?.username}</h4>
              <span className={twMerge('text-xs text-gray-600 dark:text-gray-300')}>{userData?.email}</span>
            </div>
            <HiOutlineLogout
              className="hover:cursor-pointer"
              size={20}
              title='Logout'
              onClick={handleLogout}
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext!) || { expanded: false };

  return (
    <li
      className={twMerge(`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
          : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-gray-600 dark:text-gray-300"
        }
    `)}
    >
      {icon}
      <span
        className={twMerge(`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`)}
      >
        {text}
      </span>
      {alert && (
        <div
          className={twMerge(`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`)}
        />
      )}

      {!expanded && (
        <div
          className={twMerge(`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `)}
        >
          {text}
        </div>
      )}
    </li>
  );
}