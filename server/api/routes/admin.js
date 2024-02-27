var express = require('express');
const userAuth = require('../controller/userAuth')
var router = express.Router();
var adminAuth = require('../controller/adminAuth')


router.post('/admin-login',adminAuth.login)


module.exports = router;
