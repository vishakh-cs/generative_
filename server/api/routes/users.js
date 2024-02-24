var express = require('express');
const userAuth = require('../controller/userAuth')
var router = express.Router();


router.post('/signup',userAuth.signUp)


module.exports = router;
