# [www.remove-background.ai](https://www.remove-background.ai) API wrapper for Node.js

<img src="https://github.com/Remove-Background-ai/rembg.js/blob/main/media/background-remove-preview.png" width="400px"  />


Best and the **ONLY FREE** AI background removal for **node.js** , www.remove-background.ai API is extremly easy to use.


## Requirements
Get your API key from the [www.remove-background.ai website](https://www.remove-background.ai/api-usage).

## Installation

```bash
TODO
```

## Library

```typescript
import rembg from "rembg.js";

// log upload and download progress
const onDownloadProgress = console.log;
const onUploadProgress = console.log;

rembg({
    inputImagePath: 'input.png',
    onDownloadProgress,
    onUploadProgress
}).then(({ outputImagePath, cleanup }) => {
    console.log('path', outputImagePath);
    cleanup();
});
```