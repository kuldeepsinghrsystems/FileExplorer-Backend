const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.get('/showFiles', fileController.showFiles);
router.get('/files/:type', fileController.getFilesByType);

module.exports = router;
