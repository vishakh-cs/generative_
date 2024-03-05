const express = require('express');
const UserModel = require('../Model/userCollection');
const Workspace = require('../Model/workspaceSchema');

const sidebarUser = async (req, res) => {
    try {
        console.log("hiii");
        const { workspaceId } = req.body;
        console.log("workspaceId",workspaceId);
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace not found' });
        }
        const user = await UserModel.findById(workspace.owner);
         console.log("userrr",user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        

        const userDataForSidebar = {
            username: user.username,
            email: user.email,
            
        };

        res.status(200).json({ success: true, data: userDataForSidebar });
    } catch (error) {
        console.error('Error fetching sidebar user data:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    sidebarUser,
};
