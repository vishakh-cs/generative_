"use client"

import React, { useState, useEffect } from 'react';
import { BiRefresh } from 'react-icons/bi';
import axios from 'axios';
import Sidebar from '@/components/Sidebar/page';
import Loaders from '@/components/Loaders/page';
import { UserData } from '@/app/type'; 
import { toast } from 'react-toastify';

export default function UserManagement() {
    const [isTableVisible, setTableVisibility] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/userdata');
            setUserData(response.data.users); 
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleButtonClick = () => {
        setLoading(true);
        fetchUserData();
    };

    const handleBlockUnblock = async (userId) => {
        try {
            const response = await axios.post(`http://localhost:8000/blockuser/${userId}`);
            if (response.data.success) {
                toast.success("Successfully blocked the account!");
    
                // Update the userData state with the modified user
                setUserData(prevUserData => {
                    return prevUserData.map(user => {
                        if (user._id === userId) {
                            return { ...user, isBlocked: !user.isBlocked };
                        }
                        return user;
                    });
                });
            } else {
                toast.error("Failed to block the account! Please try again.");
            }
        } catch (error) {
            console.error("Error blocking the account:", error);
            toast.error("Failed to block the account! Please try again.");
        }
    };
    

 
    
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
                        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">
                            User Management Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Welcome to the User Management section. Here you can manage and view user details.
                        </p>

                        <div className='flex justify-center items-center h-1/3 py-5'>
                            {isLoading ? (
                                <Loaders />
                            ) : (
                                <button className='bg-blue-400 rounded-lg h-11 w-1/5 font-bold' onClick={handleButtonClick}>
                                    {isTableVisible ? (
                                        <BiRefresh className="inline-block mr-2" size={30} />
                                    ) : (
                                        'Click here to load the data'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Table Section */}
                        {isTableVisible && (
                            <section className="container px-4 mx-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:text-black">
                                        {userData.map((row) => (
                                            <tr key={row.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{row._id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{row.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{row.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                        className={`${
                                                            row.isBlocked ? 'bg-red-500' : 'bg-green-500'
                                                        } text-white px-4 py-2 rounded`}
                                                        onClick={() => handleBlockUnblock(row._id)}
                                                    >
                                                        {row.isBlocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )}

                        {/* Pagination Section */}
                        <div className="flex items-center justify-between mt-6">
                            {/* ... Your pagination code */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
