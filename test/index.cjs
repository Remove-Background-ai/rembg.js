import rembg from '../dist/index.js';

// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    inputImagePath: '../examples/input.png',
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log('path', outputImagePath);
    cleanup();
});
