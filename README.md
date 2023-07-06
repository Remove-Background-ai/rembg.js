# [www.remove-background.ai](https://www.remove-background.ai) API wrapper for Node.js

<img src="https://github.com/Remove-Background-ai/rembg.js/blob/main/media/background-remove-preview.png" width="400px"  />


Best and the **ONLY FREE** AI background removal for **node.js** , www.remove-background.ai API is extremely easy to use.


## Requirements
Get your API key from the [www.remove-background.ai website](https://www.remove-background.ai/api-usage).
PS: you can still use the API without key but it is very limited

## Installation

```bash
npm i --save @remove-background-ai/rembg.js
```

## Library

```typescript

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
    console.log('path', outputImagePath);
    // if called, it will cleanup your removed background image
    cleanup();
});
```