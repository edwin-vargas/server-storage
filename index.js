//import zone
const express = require('express')
const path = require('path')
const cors = require('cors')
const multer = require('multer');
const PORT = process.env.PORT ?? 1234
const publicDirectoryPath = path.join(__dirname, 'client')


//server init
const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        '149.19.169.11:3000',
        '149.19.169.11', 
        'http://192.168.106.177:3000',
        'http://192.168.106.177'

        
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    // Define the destination folder for uploaded files
    const uploadPath = path.join(__dirname, 'uploads'); // Store files in the 'uploads' folder relative to your script.
    cb(null, uploadPath);
},
filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
},
});

const upload = multer({ storage: storage });

//API

app.post("/upload", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
  
      const filePath = req.file.path;
      const fileName = req.file.filename;
      const fileUrl = `/uploads/${fileName}`;
  
      console.log("File uploaded:", fileName);
      console.log("File path:", filePath);
  
      res.json({
        message: "File uploaded successfully!",
        fileName,
        filePath,
        fileUrl,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "File upload failed." });
    }
  });

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})
