const express = require('express');
const UserModel = require('../Model/userCollection');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');



const signUp = async (req, res) => {
  try {
    const { UserName, phonenumber, email, password, confirmPassword } = req.body;

    // Check if the email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username:UserName,
      phone: phonenumber,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    console.log('User saved successfully.');

    return res.status(200).json({
      success: true,
      message: 'User signed up successfully.',
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during sign-up:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error during sign-up',
    });
  }
};


module.exports = {
  signUp,
};
