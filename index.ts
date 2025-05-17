import * as fs from 'fs';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { file as tmpFile } from 'tmp-promise';
import { Buffer } from 'buffer';

type InputType = string | Buffer | { base64: string };
type Options = {
  returnMask?: boolean;
  returnBase64?: boolean, // by default, it won't return a Base64 string
  w: number;
  h: number;
  exact_resize?: boolean;
}
/**
 * Removes the background from an image using the rembg.com API.
 * 
 * @param apiKey - The API key for rembg.com.
 * @param inputImage - file path, Buffer, or an object with a { base64: string } property.
 * @param onUploadProgress - A callback function to handle upload progress events. Defaults to console.log.
 * @param onDownloadProgress - A callback function to handle download progress events. Defaults to console.log.
 * @param Options - set of options for image Post processing.
 * @param options.returnMask - If true, returns the alpha-Matte (mask) image instead of the image.
 * @param options.returnBase64 - If true, returns the output image as a Base64 string instead of saving it to a file.
 * @param options.w - The width of the output image.
 * @param options.h - The height of the output image.
 * @param options.exact_resize - If true, the output image will be resized to the specified width and height.
 * @returns If returnBase64 is true, returns an object with the base64Image property containing the Base64 string of the output image.
 *          If returnBase64 is false, returns an object with the outputImagePath property containing the path to the output image file,
 *          and the cleanup function to delete the temporary file.
 * @throws Throws an error if the API key is not provided or if the request fails.
 */
export const rembg = async ({
  apiKey,
  inputImage,
  options,
  onUploadProgress = console.log, // it will log every uploadProgress event by default
  onDownloadProgress = console.log, // it will log every uploadProgress event by default
}: {
  apiKey: string;
  inputImage: InputType;
  options?: Options;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void;
}) => {
  if (!apiKey) throw new Error(' ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️: API key not provided, trials will be very limited.');

  const { 
    returnMask = false, 
    returnBase64 = false,
    w = 0, 
    h = 0, 
    exact_resize = false 
  } = options || {};

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


  data.append('exact_resize', exact_resize.toString());
  data.append('w', w);
  data.append('h', h);
  data.append('mask', returnMask.toString());
  data.append('return_base64', returnBase64.toString());

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
