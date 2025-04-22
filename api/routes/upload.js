const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists in public folder
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created:', uploadsDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Upload single file
router.post('/single', (req, res, next) => {
  console.log('Upload route hit: /single');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  // Multer middleware'ini manuel olarak çağır
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
    
    try {
      console.log('File upload request processed');
      console.log('Request file:', req.file);
      
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      console.log('File uploaded successfully:', req.file);
      
      res.json({
        success: true,
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// Upload multiple files
router.post('/multiple', upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const files = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }));
    res.json({
      message: 'Files uploaded successfully',
      files: files
    });
  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 