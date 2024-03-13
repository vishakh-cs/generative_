import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { twMerge } from 'tailwind-merge';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { RiLoader4Line, RiCheckLine, RiDeleteBinLine, RiPencilLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import toast, { Toaster } from 'react-hot-toast';
import { IoIosArrowDropdown } from "react-icons/io";
import { RiBriefcaseFill } from "react-icons/ri";
import { Switch } from "@/components/ui/switch"
import { useEdgeStore } from '@/lib/edgestore';



export default function ProfileSlider({ avatarData }) {
  const [avatarImage, setAvatarImage] = useState(avatarData?.profileImage);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(avatarData?.username);
  const audioRef = useRef(null);
  const { edgestore } = useEdgeStore();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);

      try {
        // Upload image to edge store
        const uploadResponse = await edgestore.publicFiles.upload({
          file: file,
          options: {
            // Add any additional options here
          },
          onProgressChange: (progress) => {
            console.log(progress);
          },
        });
        toast.success('Image uploaded successfully');

        if (audioRef.current) {
          audioRef.current.play();
        }

        // Get the uploaded image URL from the response
        const imageUrl = uploadResponse.url;
        setAvatarImage(imageUrl);

        // Save the image URL to the database
        const saveResponse = await axios.post('http://localhost:8000/setProfileImageUrl', {
          profileImage: imageUrl,
          emailId: avatarData?.email
        });

        // Check if the image URL is successfully saved in the database
        if (saveResponse.data.success) {
          setSuccess(true);
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Failed to save image URL in the database');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };


  const uploadImage = async (file) => {
    setTimeout(async () => {
      console.log('Uploading file:', file);
      setLoading(false);
      setSuccess(true);
      toast.success('Image uploaded successfully');

      if (audioRef.current) {
        audioRef.current.play();
      }

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }, 2000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleDeleteAllWorkspaces = () => {
    console.log('Deleting all workspaces...');
  };

  const handleEditUsername = () => {
    console.log('Editing username...');
    setIsEditingUsername(true);
  };

  const handleSaveUsername = () => {
    console.log('Saving new username:', newUsername);
    setIsEditingUsername(false);
  };

  return (
    <Sheet>
      <SheetTrigger className='w-12'>
        <Avatar>
          <AvatarImage src={avatarImage} />
          <AvatarFallback
            className={twMerge(`
              rounded-full
              h-12
              bg-gray-200 dark:bg-gray-600
              text-gray-500 dark:text-gray-400
              flex items-center justify-center relative
            `)}
          >
            {loading && <RiLoader4Line className="absolute animate-spin text-white" />}
            {!loading && (
              <>
                <img
                  src={avatarData?.profileImageUrl}
                  alt="profile image"
                />
                {success && <RiCheckLine className="absolute bottom-0 right-0 text-green-500" />}
              </>
            )}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className='bg-gray-950'>
        <SheetHeader>
          <h4 className={twMerge('font-semibold')}>Profile</h4>

          <div className={twMerge('box')}>
            <div className={twMerge('box-item')}>
              <div className={twMerge('flex justify-center')}>
                <Avatar className='w-32'>
                  <AvatarImage src={avatarImage} />
                  <AvatarFallback
                    className={twMerge(`
                     rounded-full
                     h-32
                     bg-gray-200 dark:bg-gray-600
                     text-gray-500 dark:text-gray-400
                     flex items-center justify-center relative
                    `)}
                  >
                    {loading && <RiLoader4Line className="absolute animate-spin text-white" />}
                    {loading ? (
                      <RiLoader4Line className="absolute animate-spin text-white" />
                    ) : avatarData?.profileImageUrl ? ( 
                      <img src={avatarData.profileImageUrl} alt="profile image" /> 
                    ) : (
                      <span>{avatarData?.username.slice(0, 2).toUpperCase()}</span> 
                    )}
                    {success && <RiCheckLine className="absolute bottom-0 right-0 text-green-500" />}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className={twMerge('flex justify-center text-sm mt-2')}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatarUpload"
                />
                {loading ? (
                  <RiLoader4Line className="animate-spin text-white mr-2" />
                ) : (
                  <button onClick={() => document.getElementById('avatarUpload').click()}>
                    Upload Profile Image
                  </button>
                )}
                {success && <RiCheckLine size={20} className="text-green-500" />}
                <audio ref={audioRef} src="/Assets/uploadsound (1).mp3" />
              </div>
            </div>

            <div className={twMerge('box-item')}>
              <div className={twMerge('flex items-center mt-4 border-gray-200 rounded-lg h-16 w-full border')}>
                <span className={twMerge('text-gray-500 dark:text-gray-400 mr-2 ml-3')}>
                  {avatarData?.username}
                </span>
                {isEditingUsername ? (
                  <>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className={twMerge('border-b border-gray-500 dark:border-gray-400 bg-transparent text-white px-1')}
                    />
                    <button onClick={handleSaveUsername} className={twMerge('text-blue-500 hover:underline')}>
                      Save
                    </button>
                  </>
                ) : (
                  <RiPencilLine
                    color='green'
                    size={20}
                    className={twMerge('cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-500')}
                    onClick={handleEditUsername}
                  />
                )}
              </div>

              <div className={twMerge('flex items-center mt-4')}>
                <span className={twMerge('text-gray-500 dark:text-gray-400 flex items-center mt-4 border-gray-200 rounded-lg h-16 w-full border px-4')}>
                  {avatarData?.email}
                </span>
              </div>

              <div className={twMerge('flex justify-between items-center mt-4')}>
                <span className={twMerge('font-sans text-gray-500 dark:text-gray-400 flex items-center cursor-pointer- mt-4 border-gray-50 rounded-lg h-9 w-full border px-4')}>
                  Add another account <span className='flex ml-32'></span>
                </span>
              </div>

              <div className={twMerge('flex justify-between items-center mt-4')}>
                <span className={twMerge('text-gray-500 dark:text-gray-400 flex items-center mt-4 border-green-400 rounded-lg h-20 w-full border px-4')}>
                  <span className='mr-2'><RiBriefcaseFill /></span> My Workspaces <span className='flex ml-32'><IoIosArrowDropdown color='green' size={25} /></span>
                </span>
              </div>


              <div className={twMerge('flex justify-between items-center mt-32')}>
                <span className={twMerge('text-gray-500 dark:text-gray-400 mr-2')}>
                  Dark Mode/Light Mode
                </span>
                <RiSunLine
                  size={20}
                  className={twMerge('cursor-pointer text-yellow-500 hover:text-yellow-700')}
                  onClick={toggleDarkMode}
                />
                <Switch />

              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}