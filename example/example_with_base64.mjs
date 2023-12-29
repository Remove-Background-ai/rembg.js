import { rembg } from '../dist/index.js';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

// API_KEY will be loaded from the .env file
const API_KEY = process.env.API_KEY;
// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    // apiKey: API_KEY,
    inputImagePath: './input.jpg',
    onDownloadProgress,
    onUploadProgress,
    returnBase64: true
}).then(({ base64Image }) => {
    console.log(`✅🎉 background removed ${base64Image}`);
});