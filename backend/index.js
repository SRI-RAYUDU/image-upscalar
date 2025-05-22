const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;


const uploadsDir = path.join(__dirname, 'uploads');
const publicDir = path.join(__dirname, 'public');
const frontendDir = path.join(__dirname, '..', 'frontend');


if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));


app.use('/uploads', express.static(uploadsDir));
app.use('/public', express.static(publicDir));
app.use(express.static(frontendDir)); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


app.post('/upscale', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const originalFileName = req.file.filename;
    const originalFilePath = path.join(uploadsDir, originalFileName);
    const upscaledFileName = 'upscaled-' + originalFileName;
    const upscaledFilePath = path.join(publicDir, upscaledFileName);

    fs.copyFileSync(originalFilePath, upscaledFilePath);

    const originalBase64 = fs.readFileSync(originalFilePath, 'base64');
    const upscaledBase64 = fs.readFileSync(upscaledFilePath, 'base64');

    res.json({
      original: `data:image/jpeg;base64,${originalBase64}`,
      upscaled: `data:image/jpeg;base64,${upscaledBase64}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
