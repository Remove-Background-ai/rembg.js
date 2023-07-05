# [www.remove-background.ai](https://www.remove-background.ai) API wrapper for Node.js


<img src="https://github.com/xxxxx/rembg/raw/master/media/media/background-remove-preview.png" width="600px" height="400px" />


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

rembg('input.png').then(({ outputImagePath, cleanup }) => {
    console.log('path', outputImagePath);
    // cleanup the temporary file
    cleanup();
  }
);
```