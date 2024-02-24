"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn , signOut , useSession } from 'next-auth/react';

export default function Navbar() {

 const router = useRouter();
 const {status} = useSession();

  // status === "authenticated"


  const handleSignup =((e)=>{
    e.preventDefault();
    router.push('/signup')
  })
  
  const handlelogin=((e)=>{
    e.preventDefault();
    router.push('/login')
  })

  return (
    <header className="p-2 dark:bg-opacity-40 dark:bg-gray-700 dark:text-gray-100 fixed w-full top-0 z-50" style={{ backdropFilter: 'blur(20px)' }}>
      <div className="container flex justify-between h-16 mx-auto">
        <a rel="noopener noreferrer" href="#" aria-label="Back to homepage" className="flex items-center p-2 transition duration-300 ease-in-out transform hover:scale-105">
          <Image className='h-full object-contain w-32'
            src="/Assets/Designer (2).png"
            alt=""
            width={200}
            height={500}
          />
        </a>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">product</a>
          </li>
          <li className="flex">
            <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">pricing</a>
          </li>
          <li className="flex">
            <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">About</a>
          </li>
          <li className="flex">
            <a rel="noopener noreferrer" href="#" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">Resources</a>
          </li>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          <button onClick={handlelogin} className="self-center px-8 py-3 rounded transition duration-300 ease-in-out transform hover:scale-105">Login</button>
          <button onClick={handleSignup} className="self-center px-8 py-3 font-semibold rounded dark:bg-purple-800 dark:text-white transition duration-300 ease-in-out transform hover:scale-105">Sign up</button>
        </div>
        <button className="p-4 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 dark:text-gray-100">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
