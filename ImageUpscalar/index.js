const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upscale", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.body.scale) {
      return res.status(400).json({ error: "Missing file or scale" });
    }

    const scale = parseInt(req.body.scale);
    const originalBuffer = req.file.buffer;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const timestamp = Date.now();

    const originalFileName = `original-${timestamp}${ext}`;
    const upscaledFileName = `upscaled-${timestamp}${ext}`;
    const originalPath = path.join(__dirname, originalFileName);
    const upscaledPath = path.join(__dirname, upscaledFileName);

    fs.writeFileSync(originalPath, originalBuffer);

    const metadata = await sharp(originalBuffer).metadata();
    const width = Math.round(metadata.width * scale);
    const height = Math.round(metadata.height * scale);

    await sharp(originalBuffer)
      .resize(width, height)
      .toFile(upscaledPath);

    res.json({
      original: originalFileName,
      upscaled: upscaledFileName,
    });
  } catch (err) {
    console.error("Upscaling error:", err.message);
    res.status(500).json({ error: "Image processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});