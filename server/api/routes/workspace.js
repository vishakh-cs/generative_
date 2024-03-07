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

router.post('/bannerImage', upload.single('banner'), workspaceController.bannerImageUpload);

router.post('/sidebar_data',workspaceController.sidebarUser)

router.get('/workspace/:workspaceId',workspaceController.fechUserData);

router.post('/add_page',workspaceController.addPage)



module.exports = router;