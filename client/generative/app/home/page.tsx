// "use client"
// import Loaders from "@/components/Loaders/page";
// import { useEffect, useState } from "react";
// import UserInfo from "../UserInfo/page";
// import ProtectedRoutes from "@/components/ProtectedRoutes/page";
// import Image from "next/image";
// import { MdMoreHoriz } from "react-icons/md";
// import { MdPublish } from "react-icons/md";
// import { destroyCookie } from "nookies";
// import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { parseCookies } from "nookies";
// import { useSession } from 'next-auth/react';
// import AlertBox from "@/components/AlertBox/page";



// export default function Home() {

//   const router = useRouter();

//     const [isLoading, setIsLoading] = useState(true);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const { data: session } = useSession();

//     const toggleDropdown = () => {
//       setIsDropdownOpen((prev) => !prev);
//     };

//     const closeDropdown = () => {
//       setIsDropdownOpen(false);
//     }
  
  
//       const handleLogout = async () => {
//         destroyCookie(null, 'token');
//         await signOut({ redirect: false }); 
//         setIsDropdownOpen(false);
//         router.push('/');
//       };
      


  
//     useEffect(() => {
//       const timeout = setTimeout(() => {
//         setIsLoading(false);
//       }, 2000);
//       return () => clearTimeout(timeout);
//     }, []);
  
//     console.log('Rendering Home:', isLoading);

//     if (session) {
//       console.log('User Info:', session?.user?.name, session?.user?.email);
//     }
    
  
//     return (
//       // <ProtectedRoutes >
//       <div className="bg-customColor w-full h-full ">
//         <div>
//         <header className="p-4 dark:bg-transparent dark:text-gray-100">
// 	<div className="container flex justify-between h-8 mx-auto">
	
//     <Image className='h-full object-contain w-32'
//             src="/Assets/White logo - no background.png"
//             alt="logo"
//             width={400}
//             height={500}
//           />
		
// 		<ul className="items-stretch hidden space-x-3 md:flex">
// 			<li className="flex">
// 				<a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent">share</a>
// 			</li>

// 			<li className="flex">
// 				<a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent dark:text-violet-400 dark:border-violet-400">publish <MdPublish /></a>
// 			</li>
//       <li className="flex">
//                   <button
//                     onClick={toggleDropdown}
//                     className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent focus:outline-none"
//                   >
//                     <MdMoreHoriz size={30} />
//                   </button>
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md">
//                       <a
//                         onClick={closeDropdown}
//                         href="#"
//                         className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
//                       >
//                         Profile
//                       </a>
//                       <button
//                         onClick={handleLogout}
                        
//                         className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </li>
// 		</ul>
// 		<button className="flex justify-end p-4 md:hidden">
// 			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
// 				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
// 			</svg>
// 		</button>
// 	</div>
// </header>
//         </div>
//         {isLoading ? (
//           <Loaders />
//         ) : (
//           <div className='bg-customColor h-screen w-full'>

//             <UserInfo />
//           </div>
//         )}
//       </div>
//       // </ProtectedRoutes>
//     );
//   }
  

import React from 'react'

export default function home() {
  return (
    <div>home</div>
  )
}
