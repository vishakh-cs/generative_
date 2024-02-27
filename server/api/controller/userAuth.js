const express = require('express');
const UserModel = require('../Model/userCollection');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');



const createToken = (_id)=>{
  const jwtKey = process.env.JWT_SECRET;
  return jwt.sign({_id},jwtKey,{expiresIn:"3d"});
}


// Schedule a task to run every 3 minute
cron.schedule('* * * * *', async () => {
  try {
    const threeMinutesAgo = new Date(Date.now() -  3 *  60 *  1000); 
    await UserModel.deleteMany({
      isVerified: false,
      createdAt: { $lt: threeMinutesAgo } 
    });

    console.log('Deleted unverified users older than  3 minutes.');
  } catch (error) {
    console.error('Error deleting unverified users:', error);
  }
});

const signUp = async (req, res) => {
  try {
    const { UserName, phonenumber, email, password, confirmPassword } = req.body;

    // Check if the email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered but not verified. Verification email has been sent.',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered and verified.',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailToken = crypto.randomBytes(64).toString('hex');

    const newUser = new UserModel({
      username: UserName,
      phone: phonenumber,
      email,
      password: hashedPassword,
      emailToken,
      hasEmailToken: true, 
    });
    // Save the new user to the database
    await newUser.save();

    console.log('User saved successfully.');

     // Send verification email
     const verificationLink = `${process.env.BASE_URL}/verify?token=${emailToken}`;
     const emailTemplatePath = path.join(__dirname, '../public/EmailVerify/emailVerify.html');
     const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
     const emailContent = emailTemplate.replace(/{username}/g, UserName).replace(/{verificationLink}/g, verificationLink);
 
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
      from: "Generative",
      to: email,
      subject: 'Email Verification',
      html: emailContent,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent:', info.response);
      }
    });
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


const verifyEmail = async(req,res)=>{
  try {
    const { token } = req.query;

    if(!token) return res.status(404).json("email not found ...");

    const user = await UserModel.findOne({ emailToken: token });
    if(user){
      user.emailToken=null;
      user.isVerified=true;
      user.save();
      const acceptHeader = req.headers.accept || "";
      const isHtmlRequest = acceptHeader.includes("text/html");

      if (isHtmlRequest) {
        // Redirect to the specified page
        return res.redirect(302, '../EmailVerify/redirectpage/redirectPage.html');
      } else {
        // Send JSON response
        return res.status(200).json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,
            isVerified: user?.isVerified,
          },
          message: "Email verification successful.",
        });
      }
    } else {
      return res.status(404).json({ success: false, message: "Email verification failed. Invalid token." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
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

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Email not verified. Please check your email for verification instructions.',
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
        isVerified: true,
      });

      // Save the new user to the database
      await user.save();

      console.log('New user saved successfully.');
    }else {
      // If the user already exists, update isVerified to true
      user.isVerified = true;
      await user.save();
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
    const { userId, email } = req.body;
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
  setToken,
  verifyEmail,
};
