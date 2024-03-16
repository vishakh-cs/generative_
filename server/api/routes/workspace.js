const express = require('express');
const path = require('path');
const fs = require('fs');
const workspaceController = require('../controller/workspaceController');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'public/uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
  
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });
  

const upload = multer({ storage: storage });

router.post('/BannerImageURL', workspaceController.bannerImageUpload);

router.post('/sidebar_data',workspaceController.sidebarUser)

router.get('/workspace/:workspaceId/:pageId',workspaceController.fechUserData);

router.post('/add_page',workspaceController.addPage)

router.get('/get_page/:pageId',workspaceController.getPage);

router.get('/find_collab_user',workspaceController.searchCollabUsers); 

router.post('/send_email_notification',workspaceController.sendEmailInvite);

router.post('/change_workspace_type',workspaceController.updateWorkspaceType);

router.get('/get_workspace_data/:workspaceId', workspaceController.getWorkspaceType);

router.get('/add_collab/:userEmail/:workspaceId', workspaceController.addCollabUser);

router.post('/add_to_trash',workspaceController.addToTrash);







module.exports = router;