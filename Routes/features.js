const express = require('express');
const router = express.Router();
const { createFeature, getAllFeatures, upload } = require('../Controllers/features');

// Route to create a new feature (with file uploads)
router.post('/create', upload.array('files', 10), createFeature); // Handle up to 10 files

// Route to get all features
router.get('/get-all', getAllFeatures);

module.exports = router;
