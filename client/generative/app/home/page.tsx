"use client"
import Loaders from "@/components/Loaders/page";
import { useEffect, useState } from "react";
import UserInfo from "../UserInfo/page";
import ProtectedRoutes from "@/components/ProtectedRoutes/page";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }, []);
  
    console.log('Rendering Home:', isLoading);
  
    return (
      <ProtectedRoutes >
      <div className="bg-customColor w-full h-full">
        {isLoading ? (
          <Loaders />
        ) : (
          <div className='bg-customColor h-screen w-full'>
            <UserInfo />
          </div>
        )}
      </div>
      </ProtectedRoutes>
    );
  }
  