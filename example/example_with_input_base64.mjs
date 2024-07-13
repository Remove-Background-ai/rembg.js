import { rembg } from '../dist/index.js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables from .env file
dotenv.config();

const base64Input = readFileSync('inputBase64.txt', { encoding: 'utf8' }); // or inputRawBase64.txt

// API_KEY will be loaded from the .env file
const API_KEY = process.env.API_KEY;
// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    apiKey: API_KEY,
    inputImage: {base64: base64Input},
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log(`✅🎉 background removed and saved under path=${outputImagePath}`);
    // if called, it will cleanup your removed background image
    // cleanup();
}).catch(error => {
    console.error('Error removing background:', error);
});