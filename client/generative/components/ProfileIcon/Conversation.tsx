"use client"
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import './Conversation.css'
import { format } from "timeago.js";
import io from "socket.io-client"


const Conversation = ({ chat, currentUserId ,setMessages,messages }) => {

   const [userData, setUserData] = useState(null);

   const [currentChat, setCurrentChat] = useState(null);
   const socket =  useRef()


   console.log("chat",chat);

   useEffect(() => {
    // Connect to the Socket.IO server
    socket.current = io("http://localhost:5500");

    // Emit a 'new-user-add' event with the current user's ID
    socket.current.emit('new-user-add', currentUserId);

    // Listen for 'get-users' event to receive online users
    socket.current.on('get-users', (users) => {
       console.log("Online users:", users);
       // Handle online users data
    });

    // Clean up Socket.IO connection on component unmount
    return () => {
       socket.current.disconnect();
    };
 }, [currentUserId]);

    useEffect(()=>{
        const userId = chat.users.find((id)=>id!==currentUserId);
        const getUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/chatUser/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    console.log("USERDATA", userData);
                    setUserData(userData);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, [chat, currentUserId]);

    // fetch data for messsage 

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/getMessage/${chat._id}`);
                console.log("responseData",response.data);
                if (response.status === 200) {
                    setMessages(response.data);
                } else {
                    throw new Error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [chat]);

    
  return (
   <>
   <div className="chat-body">
    {messages.map((message)=>(
        <>
        <div className={message.senderId === currentUserId?"message own ":"message"}> </div>
      <span>{message.text}</span>
      <span>{format(message.createdAt)}</span>
        </>
    ))}
   </div>
   </>
  )
}

export default Conversation