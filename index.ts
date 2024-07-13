import * as fs from 'fs';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { file as tmpFile } from 'tmp-promise';
import { Buffer } from 'buffer';

type InputType = string | Buffer | { base64: string };

/**
 * Removes the background from an image using the rembg.com API.
 * 
 * @param apiKey - The API key for rembg.com.
 * @param inputImage - file path, Buffer, or an object with a base64 property.
 * @param onUploadProgress - A callback function to handle upload progress events. Defaults to console.log.
 * @param onDownloadProgress - A callback function to handle download progress events. Defaults to console.log.
 * @param returnMask - Whether to return a mask instead of the image. Defaults to false.
 * @param returnBase64 - Whether to return the output image as a Base64 string. Defaults to false.
 * @returns If returnBase64 is true, returns an object with the base64Image property containing the Base64 string of the output image.
 *          If returnBase64 is false, returns an object with the outputImagePath property containing the path to the output image file,
 *          and the cleanup function to delete the temporary file.
 * @throws Throws an error if the API key is not provided or if the request fails.
 */
export const rembg = async ({
  apiKey,
  inputImage,
  onUploadProgress = console.log, // it will log every uploadProgress event by default
  onDownloadProgress = console.log, // it will log every uploadProgress event by default
  returnMask = false, // by default, it won't return a mask, unless you set it to true it will return a mask instead
  returnBase64 = false, // by default, it won't return a Base64 string
}: {
  apiKey: string;
  inputImage: InputType;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void;
  returnMask?: boolean;
  returnBase64: boolean
}) => {
  if (!apiKey) throw new Error(' ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️: API key not provided, trials will be very limited.');

  const url = "https://api.rembg.com/rmbg";
  const API_KEY_HEADER = "x-api-key";

  const data = new FormData();

  // Handle different input types
  if (typeof inputImage === 'string') {
    // Input is a file path
    data.append('image', fs.createReadStream(inputImage));
  } else if (Buffer.isBuffer(inputImage)) {
    // Input is a Buffer
    data.append('image', inputImage, { filename: 'image.png' });
  } else if (typeof inputImage === 'object' && 'base64' in inputImage) {
    // Input is a base64 string
    let base64Data = inputImage.base64;
    
    // Remove data URL prefix if present
    if (base64Data.startsWith('data:')) {
      base64Data = base64Data.split(',')[1];
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    data.append('image', buffer, { filename: 'image.png', contentType: 'image/png' });

  } else {
    throw new Error('Invalid input type. Must be a file path, Buffer, or an object with a base64 property.');
  }


  if(returnMask === true) {
    data.append('mask', 'true');
  }

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      [API_KEY_HEADER]: apiKey,
      ...data.getHeaders()
    },
    data,
    responseType: 'arraybuffer',
    onUploadProgress,
    onDownloadProgress
  } as AxiosRequestConfig<FormData>;
  try {
    const response = await axios.request(config);
    if (returnBase64) {
      // Return a base64 string if returnBase64 is true
      const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
      return { base64Image };
    } else {
      const { path: outputImagePath, cleanup } = await tmpFile({ prefix: 'rembg-', postfix: '.png' });
      fs.writeFileSync(outputImagePath, response.data);
      return { outputImagePath, cleanup };
    }
  } catch (error: any) {

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`❌ ${error.response.status} ${error.response.data.toString()}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(`❌ ${error.message}`);

    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`❌ Request failed ${error.message}`);
    }
  }
}

export default rembg;
