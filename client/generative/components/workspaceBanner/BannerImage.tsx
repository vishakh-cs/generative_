import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useEdgeStore } from '@/lib/edgestore';
import { BannerSkeleton } from '../Loaders/bannerSkelton/page';

interface BannerImageProps {
  workspaceId: string;
  pageId: string;
}

const loader = ({ src, width, quality }: { src: string; width?: number; quality?: number }) => {
  if (src.startsWith('/')) {
    return src;
  }

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER || '';
  const url = new URL(src, baseUrl);
  url.searchParams.set('w', width?.toString() || '');
  url.searchParams.set('q', quality?.toString() || '75');

  url.searchParams.set('t', Date.now().toString());

  return url.toString();
};


const BannerImage: React.FC<BannerImageProps> = ({ workspaceId, pageId }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<any | null>(null);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const { edgestore } = useEdgeStore();

  console.log("my workspace workspace", workspace);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/workspace/${workspaceId}/${pageId}`);
        setWorkspace(response.data);
      } catch (error) {
        console.error('Error fetching workspace:', error.message);
      }
    };

    fetchWorkspace();
  }, [workspaceId, forceUpdate]);

  const handleAddBannerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };


  const handleUpload = () => {
    if (!selectedFile) {
       toast.error('No file provided!');
       return;
    }
    const uploadPromise = new Promise(async (resolve, reject) => {
       try {
         setUploading(true);
         setFile(selectedFile);
   
         // Delete the old image
         if (workspace?.page?.PageBannerImage) {
           await edgestore.publicFiles.delete(workspace.page.PageBannerImage);
         }
   
         // Upload the new image to Edge Store
         const res = await edgestore.publicFiles.upload({
           file: selectedFile,
           options: {},
           onProgressChange: (progress) => {
             console.log(progress);
           },
         });
   
         // Fetch updated workspace data with the new image URL
         const updatedWorkspace = await axios.post('http://localhost:8000/BannerImageURL', {
           workspaceId,
           pageId,
           imageUrl: res.url,
         });
   
         setWorkspace(updatedWorkspace.data);
         setForceUpdate((prev) => !prev);
         console.log('Image uploaded to Edge Store:', res.url);
         setSelectedFile(null);
         resolve('Image uploaded successfully!');
       } catch (error :any) {
         console.error('Error uploading image:', error.message);
         reject('Error uploading image');
       } finally {
         setUploading(false);
       }
    });
   
    // Use toast.promise to handle the loading, success, and error states
    toast.promise(uploadPromise, {
       loading: 'Uploading image...',
       success: 'Image uploaded successfully!',
       error: 'Error uploading image.',
    });
   };
  const memoizedImage = useMemo(() => {
    return (
      <>
        {uploading ? (
          <BannerSkeleton />
        ) : (
          <>
            {workspace?.page?.PageBannarImage ? (
              <Image
                key={uploadedImage}
                loader={loader}
                src={workspace.page.PageBannarImage}
                alt="Page Banner Image"
                width={800}
                height={100}
                className="w-full h-full"
              />
            ) : (
              <Image
                loader={loader}
                src="/Assets/defaultBanner.png"
                alt="Default Banner Image"
                width={800}
                height={100}
                className="w-full h-full"
              />
            )}
          </>
        )}
      </>
    );
  }, [uploading, workspace, uploadedImage]);
  

  console.log('Rendering component');

  return (
    <div className="bg-gray-100 font-sans h-72">
      <div className="relative bg-cover bg-center h-72">{memoizedImage}</div>
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