const cloudinary = require('../Routes/cloudinary');
const Feature = require('../Models/features');
const multer = require('multer');

// Multer storage configuration (for temporary file storage before uploading to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const uploadedFile = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },  // automatically detects file type (image/video)
            (error, result) => {
                if (error) {
                    reject(new Error('Error uploading file to Cloudinary'));
                } else {
                    resolve(result); // Return the result after upload
                }
            }
        );
        
        file.stream.pipe(uploadedFile);
    });
};

// Create a new feature with file upload
const createFeature = async (req, res) => {
  const { title, notes, category, files } = req.body;
  console.log('Incoming files:', files);  // Log the incoming files for debugging

  try {
    const uploadedFiles = [];

    if (files && files.length > 0) {
      for (let file of files) {
        const result = await uploadToCloudinary(file);
        uploadedFiles.push(result.secure_url); // Get URL from Cloudinary
      }
    }
    
    const newFeature = new Feature({
      title,
      notes,
      category,
      files: uploadedFiles, // Store Cloudinary URLs in the database
    });

    await newFeature.save();
    res.status(201).json({ message: 'Feature created successfully', feature: newFeature });
  } catch (error) {
    res.status(400).json({ message: 'Error creating feature', error: error.message });
  }
};


// Fetch all features
const getAllFeatures = async (req, res) => {
    try {
        const features = await Feature.find();
        res.status(200).json(features);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching features', error: error.message });
    }
};

module.exports = { createFeature, getAllFeatures, upload };
