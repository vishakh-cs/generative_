import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const loader = ({ src, width, quality }) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_SERVER || ''}${src}?w=${width}&q=${quality || 75}`;
};

const BannerImage = ({ workspaceId }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [workspace, setWorkspace] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  console.log('BannerImage:', workspace);
  const notify = () => toast('Here is your toast.');

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/workspace/${workspaceId}`);
        setWorkspace(response.data);
      } catch (error) {
        console.error('Error fetching workspace:', error.message);
      }
    };

    fetchWorkspace();
  }, [workspaceId, forceUpdate]);

  if (!workspace) {
    return null;
  }

  const handleAddBannerClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        toast.error('No file provided !');
        return;
      }

      const formData = new FormData();

      formData.append('workspaceId', workspaceId);
      formData.append('banner', selectedFile);

      const response = await axios.post('http://localhost:8000/bannerImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFile(null);
      setForceUpdate((prev) => !prev);
      console.log('Response12356:', response.data);
      toast.success('Image uploaded successfully!');

    } catch (error) {
      console.error('Error uploading image:', error.message);
      toast.error('Error uploading image');
    }
  };


  return (
    <div className="bg-gray-100 font-sans h-72">
      <div className="relative bg-cover bg-center h-72">
        {workspace.BannerImage && (
          <Image
          loader={loader}
          src={workspace.BannerImage}
          alt="Banner Image"
          width={800}
          height={100}
          className="w-full h-full"
        />
        )}
      </div>
      <button
        onClick={handleAddBannerClick}
        className="font-medium opacity-45 text-sm p-2"
      >
        Add a Banner Image
      </button>
      <input
        type="file"
        name="banner"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      <Toaster />
    </div>
  );
};

export default BannerImage;
