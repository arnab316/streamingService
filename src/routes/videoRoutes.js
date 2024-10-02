import express from 'express';
import upload from '../config/multerConfig.js'; 
const router = express.Router();
import { uploadVideo } from '../controllers/videoController.js';


router.post('/upload', upload.single('file'), uploadVideo); 

export default router;
