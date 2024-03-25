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
      profileImageUrl: user.profileImageUrl,

    };

    const collaboratorWorkspace = await Workspace.findOne({ collaborators: user._id });
    let collaboratorWorkspacePages = [];
    let collaboratorWorkspacePageNames = [];
    let collaboratorWorkspacePageIds = [];
    let collaboratorWorkspaceName = '';
    let collaboratorWorkspaceLogo = '';
    if (collaboratorWorkspace) {
      collaboratorWorkspacePages = await PageSchema.find({ _id: { $in: collaboratorWorkspace.pages }, Trashed: false });
      collaboratorWorkspacePageNames = collaboratorWorkspacePages.map(page => page.PageName);
      collaboratorWorkspacePageIds = collaboratorWorkspacePages.map(page => page._id);
      collaboratorWorkspaceName = collaboratorWorkspace.name;
      collaboratorWorkspaceLogo = collaboratorWorkspace.workspaceLogoIndex;
    }

    const workspaces = await Workspace.find({ owner: user._id });

    // const pages = workspace.pages || [];

    const pages = await PageSchema.find({ _id: { $in: workspace.pages }, Trashed: false });

    const pageNames = pages.map(page => page.PageName);

    const pageData = await PageSchema.find({ PageName: { $in: pageNames } });

    const pageId = pageData.map(page => page._id);

    res.status(200).json({
      success: true, data: userDataForSidebar, workspaces, pages, pageNames, pageId, collaboratorWorkspace: {
        name: collaboratorWorkspaceName,
        collablogo: collaboratorWorkspaceLogo,
        pages: collaboratorWorkspacePages,
        pageNames: collaboratorWorkspacePageNames,
        pageIds: collaboratorWorkspacePageIds,
      }
    });
  } catch (error) {
    console.error('Error fetching sidebar data:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const bannerImageUpload = async (req, res) => {
  try {

    const { workspaceId, imageUrl } = req.body;

    const Page_id = req.body.pageId

    console.log("req body", req.body);

    console.log("ppageIdpageIdageId", Page_id);

    // Assuming you want to update the Page model
    const page = await PageSchema.findById(Page_id);

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

    const user = await UserModel.findById(workspace.owner);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const responseData = {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
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
      PageName: pageName,
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

const getPage = async (req, res) => {
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

const searchCollabUsers = async (req, res) => {

  try {
    const { workspaceId, query } = req.query;

    if (!workspaceId || !query) {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(400).json({ success: false, message: "Workspace does not exist" });
    }
    // fetch user data 
    const user = await UserModel.find({
      _id: { $nin: [workspace.owner, ...workspace.collaborators] },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ]

    });
    return res.status(200).json({ success: true, message: "User searched successfully", users: user })
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

    res.json({ data: workspace, type: workspace.type });
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

const addToTrash = async (req, res) => {
  console.log("hii");
  try {
    const { selectedPage } = req.body;
    console.log("pagepage", selectedPage)

    const page = await PageSchema.findById(selectedPage);

    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    page.Trashed = true;
    await page.save();

    // Respond with success
    res.status(200).json({ message: 'Page moved to trash successfully.' });
  } catch (error) {
    console.error('Error moving page to trash:', error);
    res.status(500).json({ error: 'Failed to move page to trash.' });
  }
};

const fetchTrashData = async (req, res) => {
  try {
    // Extract workspaceId from the request parameters
    const { workspaceId } = req.params;

    // Find the workspace document by its ID
    const workspace = await Workspace.findById(workspaceId);

    // If the workspace does not exist, return an error
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Extract the page IDs from the workspace's pages array
    const pageIds = workspace.pages;

    // Find trashed pages that belong to the workspace
    const trashedPages = await PageSchema.find({
      _id: { $in: pageIds }, // Match page IDs in the workspace's pages array
      Trashed: true
    });

    // Extract page IDs and names
    const trashedPagesData = trashedPages.map(page => ({ id: page._id, name: page.PageName }));

    console.log("trashedPagesData", trashedPagesData);

    // Respond with the trashed page data
    res.status(200).json(trashedPagesData);
  } catch (error) {
    console.error("Error fetching trashed page data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const restoreFromTrash = async (req, res) => {
  try {
    const { pageId } = req.params;

    const updatedPage = await PageSchema.findOneAndUpdate(
      { _id: pageId },
      { $set: { Trashed: false } },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    res.status(200).json({ success: true, message: "Page restored successfully" });
  } catch (error) {
    console.error("Error restoring page:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await PageSchema.findById(pageId);
    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    await Workspace.updateMany(
      { pages: pageId },
      { $pull: { pages: pageId } }
    );
    await PageSchema.findByIdAndDelete(pageId);

    res.status(200).json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateWorkspaceName = async (req, res) => {
  try {
    const { workspaceId, newName } = req.body;

    if (!workspaceId || !newName) {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }
    workspace.name = newName;

    await workspace.save();

    res.status(200).json({ success: true, message: 'Workspace name updated successfully' });
  } catch (error) {
    console.error('Error updating workspace name:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCollabUser = async (req, res) => {
  console.log("hoo");
  try {
    const { workspaceId } = req.query;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID is required' });
    }
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const collaboratorIds = workspace.collaborators;

    console.log("collaboratorIds", collaboratorIds);

    const collaborators = await UserModel.find({ _id: { $in: collaboratorIds } });

    return res.status(200).json({ success: true, collaborators });
  } catch (error) {
    console.error('Error fetching collaborating users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const removeCollaborator = async (req, res) => {
  const { userId, workspaceId } = req.body;

  console.log(" req.body", req.body);

  try {
    const result = await Workspace.updateOne(
      { _id: workspaceId },
      { $pull: { collaborators: userId } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: 'Workspace not found or user not found in collaborators' });
    }

    res.json({ success: true, message: 'User removed from collaboration successfully' });
  } catch (error) {
    console.error('Error removing user from collaboration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const changeUsername = async (req, res) => {
  const { newUsername, emailId } = req.body;

  try {

    const user = await UserModel.findOne({ email: emailId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({ success: true, message: 'Username changed successfully' });
  } catch (error) {
    console.error('Error changing username:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const getProfileImage = async (req, res) => {
  const { userId } = req.params;

  try {

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const profileImageUrl = user.profileImage;

    if (!profileImageUrl) {
      return res.status(404).json({ success: false, error: 'Profile image not found for the user' });
    }
    res.status(200).json({ success: true, profileImageUrl });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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
  addToTrash,
  fetchTrashData,
  restoreFromTrash,
  deletePage,
  updateWorkspaceName,
  getCollabUser,
  removeCollaborator,
  changeUsername,
  getProfileImage,

};
