// newWorkspace check user 
"use client"
import React, { useEffect } from 'react'
import axios from 'axios';
import { useStore } from '@/Stores/store';
import { useRouter } from 'next/navigation';


function NewWorkspaceCkeck() {

    const router = useRouter();
    const userEmail = useStore((state) => state.userEmail);

    console.log("userEmail",userEmail);

    const checkWorkspace = async () => {
        try {
           const response = await axios.post('http://localhost:8000/checkNewWorkspace', {
             email: userEmail, 
           });
       
           const { hasWorkspace, workspaceId, collaboratorWorkspace } = response.data;
       
           if (hasWorkspace) {
             // If the user has their own workspace
             router.replace(`/home/${workspaceId}`);
           } else {
             router.push('/new_workspace');
           }
        } catch (error) {
           console.error('Error checking workspace:', error.message);
        }
       };
       
    
      useEffect(() => {
        checkWorkspace();
      }, []);

}

export default NewWorkspaceCkeck