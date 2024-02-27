const express = require('express');
const UserModel = require('../Model/userCollection');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const ADMIN_PASS = "alwaysAdmin"
const ADMIN_EMAIL = "admin@gmail.com";

const login = async (req, res) => {
  try {

    let { email, password } = req.body;
    console.log(email, password);

    if (email ===ADMIN_EMAIL && password === ADMIN_PASS) {

        const token = jwt.sign({ email: ADMIN_EMAIL }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token, });
    } else {

        return res.status(401).json({ success: false, msg: "Invalid email or password" });
    }
} catch (error) {
    console.error('Admin login failed:', error.message);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
}
};


const userManagement = async (req, res) => {
  try {
  
    const users = await UserModel.find({}, 'email username avatar isBlocked');

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};


const blockUser = async (req, res) => {
  try {
      const userId = req.params.userId;

      // Find the user by ID
      const user = await UserModel.findById(userId);

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.isBlocked = !user.isBlocked;

      const updatedUser = await user.save();

      return res.status(200).json({
          success: true,
          message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
          user: updatedUser,
      });
  } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};





module.exports={
    login,
    userManagement,
    blockUser,
}