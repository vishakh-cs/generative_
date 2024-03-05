var express = require('express');
const userAuth = require('../controller/userAuth')
const sidebarController = require('../controller/sidebarController')
var router = express.Router();

router.post('/sidebar_data',sidebarController.sidebarUser)



module.exports = router;