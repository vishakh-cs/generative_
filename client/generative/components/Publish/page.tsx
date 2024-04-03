import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MdContentCopy } from "react-icons/md";
import { Check } from "lucide-react";

function Publish({ workspaceid ,pageId}) {
  const baseUrl = 'http://localhost:3000';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishData, setPublishData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false); 

  const url = `${baseUrl}/public/preview/${workspaceid}/${pageId}`;
  console.log("url ", url);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPublished(false); 
  };

  const publish = () => {
    setLoading(true);
    setTimeout(() => {
      setIsPublished(true);
      setLoading(false);
      sendPublishRequest();
    }, 1000);
  };

  const unpublish = () => {
    setLoading(true);
    setTimeout(() => {
      setIsPublished(false);
      setLoading(false);
      sendUnpublishRequest();
    }, 1000);
  };

  const sendPublishRequest = () => {
    // Send a POST request to publish the document
    axios.post('http://localhost:8000/publish_unpublish', {workspaceId: workspaceid, published: true})
    .then(response => {
      console.log('Publish request successful');
    })
    .catch(error => {
      console.error('Error sending publish request:', error);
    });
  };

  const sendUnpublishRequest = () => {
    axios.post('http://localhost:8000/publish_unpublish', {workspaceId: workspaceid, unpublished: true})
    .then(response => {
      console.log('Unpublish request successful');
    })
    .catch(error => {
      console.error('Error sending unpublish request:', error);
    });
  };


  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <div className={`font-sans font-semibold cursor-pointer ${isPublished ? "text-green-600" : "text-gray-800"} ${isPublished ? "dark:text-green-400" : "dark:text-gray-400"}`} onClick={isPublished ? undefined : openModal}>
      {isPublished ? "Published" : "Publish"} 🌐
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center mt-4">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75" onClick={closeModal}></div>
          <div className="absolute right-0 top-0 m-8">
            <div className={`rounded-lg ${isPublished ? "bg-workspaceColor" : "bg-workspaceColor"} p-8 shadow-2xl`}>
              <h2 className={`text-lg font-bold ${isPublished ? "dark:text-white" : "dark:text-gray-200"}`}>{isPublished ? "Published 🌐" : "🌎 Are you sure you want to publish?"}</h2>
              <p className={`mt-2 text-sm ${isPublished ? "text-green-800" : "text-gray-900"} ${isPublished ? "dark:text-white" : "dark:text-blue-200"}`}>
                {isPublished ? "Anyone who has this link will be able to view this." : "Once published, your changes will be visible to everyone. Are you sure you want to proceed?"}
              </p>
              {isPublished ? (
                <div>
                  <div className="mt-4 flex items-center gap-2 ">
                    <input
                      className="flex-1 text-gray-200 px-2 text-xs border rounded-l-md h-10 bg-muted truncate"
                      value={url}
                      disabled
                    />
                    <button
                      onClick={onCopy}
                      disabled={copied}
                      className="h-8 rounded-l-none"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <MdContentCopy color='white' size={18} className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <button className="rounded bg-gray-600 w-full font-bold text-white px-4 py-2 mt-2" onClick={unpublish}>Unpublish</button>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button type="button" className={`rounded ${isPublished ? "bg-green-100" : "bg-green-50"} px-4 py-2 text-sm font-medium ${isPublished ? "text-green-600" : "text-green-800"}`} onClick={loading ? null : publish}>
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      "Yes, Publish"
                    )}
                  </button>
                  <button type="button" className={`rounded ${isPublished ? "bg-green-200" : "bg-gray-50"} px-4 py-2 text-sm font-medium ${isPublished ? "text-green-600" : "text-gray-600"}`} onClick={(e) => { e.stopPropagation(); closeModal(); }}>
                    No, Go Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Publish;
