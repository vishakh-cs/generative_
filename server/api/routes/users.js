var express = require('express');
const userAuth = require('../controller/userAuth')
var router = express.Router();


router.post('/signup',userAuth.signUp)

router.post('/login',userAuth.Login)

router.post('/googlelogin',userAuth.googlelogin);

router.post('/set-token',userAuth.setToken);

router.post('/verifyEmail',userAuth.verifyEmail)

router.get('/verify',userAuth.verifyEmail)




module.exports = router;
