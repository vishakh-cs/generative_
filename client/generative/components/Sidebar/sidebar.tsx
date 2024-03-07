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
  const [pages, setPages] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const setIsLogoutClicked = useStore((state) => state.setLogoutClicked);
  const workspaceName = useStore((state) => state.workspaceName)

  console.log("page", workspaces.page);


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

  console.log("workspaces dfd", workspaces);

  useEffect(() => {
    // fetch user and workspace data
    const fetchData = async () => {
      try {
        if (!params.workspaceid) {
          return;
        }

        const response = await axios.post('http://localhost:8000/sidebar_data', {
          workspaceId: params.workspaceid,
        });

        const { data, workspaces, pages } = response.data;

        setUserData(data);
        setWorkspaces(workspaces);
        const selectedWorkspace = workspaces.find(w => w.id === params.workspaceid);

        setPages(pages || []);

      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData();
  }, [params.workspaceId]);


  const createNewWorkspace = async () => {
    try {
      console.log('Creating a new workspace...');
    } catch (error) {
      console.error('Error creating new workspace:', error.message);
    }
  };

  const handleLogout = () => {
    setIsLogoutClicked(true);
  };

  const handleModalSubmit = async (pageName) => {
    const newPage = pageName.trim() || `Page ${pages.length + 1}`;
    setPages((prevPages) => [...prevPages, newPage]);
    console.log(`Added a new page: ${newPage}`);
    closeModal();

    try {
      await axios.post('http://localhost:8000/add_page', {
        workspaceId: params.workspaceid,
        pageName: newPage,
      });
    } catch (error) {
      console.error('Error updating workspace with new page:', error.message);
    }
  };



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
                  />
                )}
                <span className={twMerge('flex justify-between items-center w-full')}>
                  <span className={twMerge('text-gray-600 dark:text-gray-300 ml-4')}>
                    {workspace.name}
                  </span>
                  <IoMdAdd
                    onClick={addNewPage}
                    size={16}
                    className='ml-4 mt-1' />
                </span>

              </button>

            ))}
            {pages && pages.map((page, pageIndex) => (
              <button
                key={pageIndex}
                className={twMerge('border-t flex justify-between items-center p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700')}
              >
                <span className={twMerge('text-gray-600 dark:text-gray-300 ml-7')}>
                  {page}
                </span>
                <CiFileOn size={20} className="ml-auto" />
              </button>
            ))}

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
          <Avatar>
            <AvatarImage src={userData?.profileImage} />
            <AvatarFallback>{userData?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
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
  const { expanded } = useContext(SidebarContext);

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
