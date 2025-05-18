# [www.rembg.com](https://www.rembg.com) API wrapper for Node.js

<img src="https://github.com/Remove-Background-ai/rembg.js/blob/main/media/background-remove-preview.png" width="400px"  />


A simple, **FREE** AI background removal tool for **Node.js**. Currently, this is **THE ONLY FREE** library available for personal usage from API. Check out our website at www.rembg.com for more details.


## 🚨 Minimum Node.js Version 🚨
To use **@remove-background-ai/rembg.js**, you **must** have Node.js **v18.17.0 or higher** installed.


## Requirements
Get your **FREE** API Key from the https://www.rembg.com/api-usage
PS: you can still use the API Keys without key but it is very limited

## Installation

```bash
npm i --save @remove-background-ai/rembg.js
```

## API reference
| Parameter                 | Type(s)                                          | Required | Default | Notes                                                  |
| ------------------------- | ------------------------------------------------ | -------- | ------- | ------------------------------------------------------ |
| **apiKey**                | `string`                                         | ✔︎       | —       | Rembg API key (free tier available).                   |
| **inputImage**            | `string` <br> `Buffer` <br> `{ base64: string }` | ✔︎       | —       | Image path, buffer or base-64 wrapper. ([npm][1])      |
| **onDownloadProgress**    | `(AxiosProgressEvent)=>void`                     | –        | —       | Called repeatedly while result is streamed. ([npm][1]) |
| **onUploadProgress**      | `(AxiosProgressEvent)=>void`                     | –        | —       | Called repeatedly while upload is streamed. ([npm][1]) |
| **options.returnBase64**  | `boolean`                                        | –        | `false` | Return base-64 instead of temp file. ([npm][1])        |
| **options.returnMask**    | `boolean`                                        | –        | `false` | Return alpha-mask image only. ([npm][1])               |
| **options.w**             | `number`                                         | –        | —       | Target width (keeps aspect). ([npm][1])                |
| **options.h**             | `number`                                         | –        | —       | Target height (keeps aspect). ([npm][1])               |
| **options.exact\_resize** | `boolean`                                        | –        | `false` | Force exact `w × h` (can distort). ([npm][1])          |

[1]: https://www.npmjs.com/package/%40remove-background-ai/rembg.js "@remove-background-ai/rembg.js - npm"

## Library

inputImage can be one of these:
`string | Buffer | { base64: string };`

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
    inputImage: './input.png',
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log(`✅🎉 background removed and saved under path=${outputImagePath}`);
    // if called, it will cleanup (remove from disk) your removed background image
    // cleanup();
});
```


## Base64 return type example

if you wish to return a Base64 instead of temporary URL you can use retrunBase64 parameter:

```typescript
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
    inputImage: './input.png',
    onDownloadProgress,
    onUploadProgress,
    options: {
        returnBase64: true
    }
}).then(({ base64Image }) => {
    console.log(`✅🎉 background removed ${base64Image}`);
});
```

## Input Image as Base64 or Buffer

Since version 1.1.8, the rembg function can accept an input image as a Buffer or Base64 object. Below is a quick demonstration:

```typescript
import { rembg } from '../dist/index.js';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

const base64Input = 'data:image/png;base64,/9j/4AAQSkZJRgABAQEASABIAAD/.....etc'
// API_KEY will be loaded from the .env file
const API_KEY = process.env.API_KEY;
// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    apiKey: API_KEY,
    inputImage: {base64: base64Input}, // or simply an imageBuffer
    onDownloadProgress,
    onUploadProgress,
    options: {
        returnBase64: true
    }
}).then(({ base64Image }) => {
    console.log(`✅🎉 background removed ${base64Image}`);
});
```

## Usage of `returnMask` flag

The library provides an option to return a mask of the image instead of the processed image. This is controlled by the `returnMask` parameter. 
When set to `true`, the function returns a mask. By default (if omitted), this parameter is set to `false`.

### Code Snippet

```typescript
rembg({
    apiKey: API_KEY,
    inputImage: './input.jpg',
    onDownloadProgress,
    onUploadProgress,
    options: {
        returnMask: true, // <----- Set to true to get the mask of the image
        returnBase64: true // Set to true to receive the result as a Base64 string
    }

}).then(({ base64Image }) => {
    console.log(`✅🎉 Mask retrieved: ${base64Image}`);
});
```

Below is the generated mask image using the `rembg` function with the mask option enabled:

![Generated Mask](media/generated_mask.png)

This image demonstrates the result of the mask generation process. The mask typically highlights the main subject of the image with the background removed or made transparent.

This is very useful to work with `Stable Diffusion` for perfect area of inpainting, for example.


## Remove Background and Resize


### Code Snippet

```typescript
rembg({
    apiKey: API_KEY,
    inputImage: './input.jpg',
    onDownloadProgress,
    onUploadProgress,
    options: {
        w: 1000, 
        h: 760 // When both `w` and `h` are provided, RemBG will find the best dimensions that fit within the requested width and height while preserving the aspect ratio. 
            // If you want to guarantee the exact size, set `exact_resize: true`.
        // exact_resize: true !!! be careful it can cause distortion !!!
    }

}).then(({ base64Image }) => {
    console.log(`✅🎉 Mask retrieved: ${base64Image}`);
});
```