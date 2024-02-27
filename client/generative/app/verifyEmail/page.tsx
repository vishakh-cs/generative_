import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'

function verifyEmail() {
    const {user ,updateUser} = useContext(Authcontext);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(false);
    const [searchParams,setSearchParams]=useSearchParams();
    const router = useRouter()

    const emailToken = searchParams.get("emailToken");
    console.log("user",user)
 
    useEffect(()=>{

    },[emailToken,user])

  return (
    <div>verifyEmail</div>
  )
}

export default verifyEmail