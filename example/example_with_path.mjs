import { rembg } from '../dist/index.js';
// Load environment variables from .env file
// API_KEY will be loaded from the .env file
const API_KEY = 'bd2c391e-5109-408a-bc4b-a48de8be13c1';
// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    apiKey: API_KEY,
    inputImagePath: './input.jpg',
    onDownloadProgress,
    onUploadProgress,
    returnMask: true,
}).then(({ outputImagePath, cleanup }) => {
    console.log(`✅🎉 background removed and saved under path=${outputImagePath}`);
    // if called, it will cleanup your removed background image
    // cleanup();
});