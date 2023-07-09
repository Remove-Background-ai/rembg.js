# [www.remove-background.ai](https://www.remove-background.ai) API wrapper for Node.js

<img src="https://github.com/Remove-Background-ai/rembg.js/blob/main/media/background-remove-preview.png" width="400px"  />


A simple, **FREE** AI background removal tool for **Node.js**. Currently, this is **THE ONLY FREE** library available for personal usage from API. Check out our website at www.remove-background.ai for more details.

## Requirements
Get your **FREE** API Key from the https://www.remove-background.ai/api-usage
PS: you can still use the API Keys without key but it is very limited

## Installation

```bash
npm i --save @remove-background-ai/rembg.js
```

## Library

```typescript
// script.mjs file

import  { rembg } from '@remove-background-ai/rembg.js';
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
    inputImagePath: './input.png',
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log(`✅🎉 background removed and saved under path=${outputImagePath}`);
    // if called, it will cleanup (remove from disk) your removed background image
    // cleanup();
});
```