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
    apiKey: API_KEY,
    inputImage: './input.jpg',
    options: {
        format: "png" // by default it is a WEBP! because it works for most people!
        //returnBase64: true,
        //returnMask: false,
        //h: 300,
        //w: 300,
        //exact_resize: false, !!! Be careful if not used carefully, it can cause image distortion
    },
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    // console.log(`✅🎉 background removed and saved under path=${outputImagePath}`);
    console.log(`✅🎉 background is removed and it is saved under this path=${outputImagePath}`);
    // if called, it will cleanup your removed background image
    cleanup();
});