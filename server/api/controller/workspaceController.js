const express = require('express');
const UserModel = require('../Model/userCollection');
const Workspace = require('../Model/workspaceSchema');

const sidebarUser = async (req, res) => {
    try {
        const { workspaceId } = req.body;
        // console.log("workspaceId", workspaceId);
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace not found' });
        }
        const user = await UserModel.findById(workspace.owner);
        console.log("userrr", user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }


        const userDataForSidebar = {
            username: user.username,
            email: user.email,

        };
        // Fetch workspace data
        const workspaces = await Workspace.find({ owner: user._id });

        const pages = workspace.pages || [];

        res.status(200).json({ success: true, data: userDataForSidebar, workspaces ,pages });
    } catch (error) {
        console.error('Error fetching sidebar data:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const bannerImageUpload = async (req, res) => {
  try {
    console.log('Request received');
    const workspaceId = req.body.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID is required' });
    }

    const uploadedImage = req.file;

    if (!uploadedImage) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${uploadedImage.filename}`;

    const workspace = await Workspace.findByIdAndUpdate(workspaceId, { BannerImage: imageUrl }, { new: true });

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    res.status(200).json({ success: true, message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading banner image:', error);
    res.status(500).json({ success: false, message: 'Internal server error ' });
  }
};

const fechUserData= async(req,res)=>{
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


const addPage =  async(req,res)=>{
   try {

    const {workspaceId,pageName} = req.body;

    if(! workspaceId || !pageName){
      return res.status(400).join({success:false,message:'Invalid request parameters' });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    workspace.pages.push(pageName);

    const updatedWorkspace = await workspace.save();
    res.status(200).json({
      success: true,
      message: 'Page added successfully',
      updatedWorkspace,
    });
    
  } catch (error) {
    console.error('Error adding page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
    sidebarUser,
    bannerImageUpload,
    fechUserData,
    addPage,
};
