const express = require('express');
const UserModel = require('../Model/userCollection');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }
     const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict', 
    });

    // Include the token in the response
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error during login',
    });
  }
};

const googlelogin = async (req, res) => {
  console.log("hii");
  try {
    const { email, userName } = req.body;

    // Check if the email is already registered
    let user = await UserModel.findOne({ email });

    if (!user) {
      // If the user does not exist, create a new user instance
      user = new UserModel({
        email,
        username: userName,
      });

      // Save the new user to the database
      await user.save();

      console.log('New user saved successfully.');
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT token as a cookie in the response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'User authenticated successfully.',
      token,
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error during Google login:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error during Google login',
    });
  }
};

const setToken = (req, res) => {
  try {
    // Get user data from the request body or wherever it's stored
    const { userId, email } = req.body;

    // Generate a JWT token for the user
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token as a response
    res.status(200).json({
      success: true,
      message: 'Token generated successfully.',
      token,
    });
  } catch (error) {
    console.error('Error setting token:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error setting token',
    });
  }
};

module.exports = {
  signUp,
  Login,
  googlelogin,
  setToken
};
