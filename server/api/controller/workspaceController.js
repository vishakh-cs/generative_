const express = require('express');
const UserModel = require('../Model/userCollection');
const Workspace = require('../Model/workspaceSchema');
const PageSchema = require('../Model/PageSchema');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); 

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
            profileImageUrl:user.profileImageUrl,

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
    const { workspaceId, pageId, imageUrl } = req.body;

    // Assuming you want to update the Page model
    const page = await PageSchema.findById(pageId);

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Update the PageBannerImage field with the uploaded image URL
    page.PageBannarImage = imageUrl;

    // Save the updated page
    await page.save();

    res.status(200).json({ success: true, message: 'Image URL stored successfully' });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const fechUserData = async (req, res) => {
  try { 
    const workspaceId = req.params.workspaceId;
    const pageId = req.params.pageId;

    // Fetch the workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }
    const page = await PageSchema.findById(pageId);

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    const responseData = {
      workspace: {
        _id: workspace._id,
      },
      page: {
        _id: page._id,
        PageName: page.PageName,
        PageBannarImage: page.PageBannarImage,
        content: page.content,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching workspace and page data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const addPage = async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    const { workspaceId, pageName, pageContent } = req.body;

    if (!workspaceId || !pageName) {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    // Create a new Page object
    const newPage = new PageSchema({
      PageName :pageName,
      content: pageContent || '',
    });

    const savedPage = await newPage.save();
    workspace.pages.push(savedPage._id);

    const updatedWorkspace = await workspace.save();

    // Send the added page data to the client
    const addedPageData = {
      _id: savedPage._id,
      PageName: savedPage.PageName,
      content: savedPage.content,
    };

    res.status(200).json({
      success: true,
      message: 'Page added successfully',
      updatedWorkspace,
      addedPageData,
    });

  } catch (error) {
    console.error('Error adding page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPage = async(req,res)=>{
  try {
    const pageId = req.params.pageId;

    // Find the page by ID
    const page = await PageSchema.findById(pageId);

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Return the page details
    res.status(200).json({ success: true, PageName: page.PageName, content: page.content });
  } catch (error) {
    console.error('Error fetching page details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const searchCollabUsers = async(req,res)=>{
  console.log("hiii");

  try{
    const { workspaceId, query } = req.query;

    console.log("query",query);
    console.log("workspaceId",workspaceId);

    if(!workspaceId || !query){
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }
  
    const workspace = await Workspace.findById(workspaceId);

    if(!workspace){
      return res.status(400).json({ success: false, message: "Workspace does not exist"});
    }
    // fetch user data 
    const user = await UserModel.find({
      _id:{$nin:workspace.collaborators},
      $or:[
        {username: { $regex: query, $options: 'i' } }, 
        {email: { $regex: query, $options: 'i' } }, 
      ]

    });
    return res.status(200).json({ success: true, message: "User searched successfully", users:user})
  } catch (error) {
    console.error('Error searching collab users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const sendEmailInvite = async (req, res) => {

  const { userEmail, workspaceId } = req.body;

  try {
    // Fetch workspace name from the workspace database
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }
    const workspaceName = workspace.name;

    const addCollabLink = `${process.env.BASE_URL}/add_collab/${userEmail}/${workspaceId}`;
    const emailContentPath = path.join(__dirname, '../public/EmailVerify/EmailInvite/emailInvite.html');
    const emailContentTemplate = await fs.promises.readFile(emailContentPath, 'utf-8');

    const emailContent = emailContentTemplate.replace('{workspaceName}', workspaceName).replace(/{addCollabLink}/g, addCollabLink);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: 'Generative',
      to: userEmail,
      subject: `Collab Workspace Invite - ${workspaceName}`,
      html: emailContent,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
          success: false,
          message: 'Error sending email',
          error: error.message,
        });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({
          success: true,
          message: 'Invitation email sent successfully.',
        });
      }
    });
  } catch (error) {
    console.error('Error sending email invitation:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateWorkspaceType = async (req, res) => {
  try {
    const { workspaceId, newType } = req.body;

    if (!workspaceId || !newType) {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    // Corrected line to update the workspace type
    workspace.type = newType;

    const updatedWorkspace = await workspace.save();

    res.status(200).json({ success: true, message: 'Workspace type updated successfully', updatedWorkspace });
  } catch (error) {
    console.error('Error updating workspace type:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getWorkspaceType = async (req, res) => {
  try {
     const workspaceId = req.params.workspaceId;
     const workspace = await Workspace.findById(workspaceId);
 
     if (!workspace) {
       return res.status(404).json({ message: 'Workspace not found' });
     }
 
     res.json({ data:workspace ,type: workspace.type });
  } catch (error) {
     console.error('Error fetching workspace type:', error);
     res.status(500).json({ message: 'Server error' });
  }
 };

 const addCollabUser = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userEmail = req.params.userEmail; 

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (workspace.collaborators.includes(user._id)) {
      return res.status(400).json({ success: false, message: 'User is already a collaborator' });
    }
    workspace.collaborators.push(user._id);

    await workspace.save();

    res.send(`
    <html>
      <head>
        <title>Collaborator Added Successfully</title>
      </head>
      <body>
        <h1>Collaborator Added Successfully</h1>
        <p>The collaborator has been added to the workspace.</p>
      </body>
    </html>
  `);
}
  catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
    sidebarUser,
    bannerImageUpload,
    fechUserData,
    addPage,
    getPage,
    searchCollabUsers,
    sendEmailInvite,
    updateWorkspaceType,
    getWorkspaceType,
    addCollabUser,

};
