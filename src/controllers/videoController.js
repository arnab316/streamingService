import path from 'path';
import { fileURLToPath } from 'url';
import { transcodeVideo } from '../transcode/transcoder.js'; // Adjust import as necessary
import fs from 'fs';

// Handle the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Video upload and transcoding function
export const uploadVideo = async (req, res) => {
  const { file } = req; // Access the uploaded file

  if (!file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const uploadPath = file.path; // File path where multer stored the uploaded file
  const outputDir = path.join(__dirname, '../uploads'); // Correctly define the output directory

  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('File uploaded successfully! Starting transcoding...');
    console.log(`Transcoding output saved to: ${outputDir}`);

    await transcodeVideo(uploadPath, outputDir); // Assuming transcodeVideo takes the directory path
    res.send({ message: 'File uploaded and transcoded successfully!', filename: file.originalname });
  } catch (err) {
    console.error('Transcoding failed:', err);
    res.status(500).send({ message: 'Transcoding failed', error: err.message });
  }
};
