import { rembg } from '../dist/index.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// API_KEY will be loaded from the .env file
const API_KEY = process.env.API_KEY;

// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

console.log('🚀 Starting background removal with all parameters...');

rembg({
    apiKey: API_KEY,
    inputImage: './input.jpg', // Using file path input
    options: {
        // Basic parameters
        w: 800,                    // Width of output image
        h: 600,                    // Height of output image
        exact_resize: false,       // Keep aspect ratio (be careful if true, can cause distortion)
        format: "PNG",             // Output format (PNG, WEBP)
        
        // Return type options
        returnMask: false,         // Return alpha matte instead of processed image
        returnBase64: false,       // Return base64 string instead of file path
        
        // NEW PARAMETERS - Image processing options
       angle: 90,                 // Rotation angle in degrees
      //  expand: false,              // Add padding so rotated images aren't cropped
        bg_color: "blue"        // Background color (hex format)
    },
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log(`✅🎉 Background removed successfully!`);
    console.log(`📁 Output saved to: ${outputImagePath}`);
    console.log(`🔄 Parameters used:`);
    console.log(`   - Size: 800x600`);
    console.log(`   - Format: PNG`);
    console.log(`   - Rotation: 15 degrees`);
    console.log(`   - Expand: true (padding added)`);
    console.log(`   - Background color: #FF5733`);
    console.log(`   - Exact resize: false (aspect ratio preserved)`);
    
    // Clean up the temporary file after 5 seconds
   /* setTimeout(() => {
        cleanup();
        console.log('🧹 Temporary file cleaned up');
    }, 5000);*/
    
}).catch(error => {
    console.error('❌ Error removing background:', error);
});
