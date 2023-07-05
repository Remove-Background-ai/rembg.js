import { rembg } from '@remove-background-ai/rembg.js';


// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    inputImagePath: './input.png',
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log('path', outputImagePath);
   // cleanup();
});