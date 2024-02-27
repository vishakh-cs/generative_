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







module.exports={
    login,
}