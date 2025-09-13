import { rembg } from '../dist/index.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// API_KEY will be loaded from the .env file
const API_KEY = process.env.API_KEY;

// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

console.log('🚀 Testing mask generation with new parameters...');

rembg({
    apiKey: API_KEY,
    inputImage: './input.jpg', // Using file path input
    options: {
        // Basic parameters
        w: 512,                     // Width of output image
        h: 512,                     // Height of output image
        exact_resize: true,         // Exact resize for square output
        format: "PNG",              // Output format
        
        // Return type options
        returnMask: true,           // Return alpha matte (mask) instead of processed image
        returnBase64: false,        // Return file path
        
        // NEW PARAMETERS - Image processing options
        angle: 45,                  // Rotate 45 degrees
        expand: true,               // Add padding so rotated images aren't cropped
        // Note: bg_color is ignored when returnMask is true (as per API docs)
    },
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log(`✅🎉 Mask generated successfully!`);
    console.log(`📁 Mask saved to: ${outputImagePath}`);
    console.log(`🔄 Parameters used:`);
    console.log(`   - Size: 512x512 (exact resize)`);
    console.log(`   - Format: PNG`);
    console.log(`   - Rotation: 45 degrees`);
    console.log(`   - Expand: true (padding added)`);
    console.log(`   - Return type: mask (alpha matte)`);
    console.log(`   - Note: bg_color ignored when generating mask`);
    
    // Clean up the temporary file after 3 seconds
    setTimeout(() => {
        cleanup();
        console.log('🧹 Temporary file cleaned up');
    }, 3000);
    
}).catch(error => {
    console.error('❌ Error generating mask:', error);
});
