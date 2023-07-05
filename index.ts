import * as fs from 'fs';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
const dotenv = require('dotenv');
import { file as tmpFile } from 'tmp-promise';

// Load environment variables from .env file
dotenv.config();

// API_KEY will be loaded from the .env file
const API_KEY = process.env.API_KEY;

export const rembg = async ({
  inputImagePath,
  onUploadProgress,
  onDownloadProgress
}: {
  inputImagePath: string;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void;
}) => {
  const url = "https://api.remove-background.ai/rmbg";
  const API_KEY_HEADER = "x-api-key";

  const data = new FormData();
  data.append('image', fs.createReadStream(inputImagePath));


  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      [API_KEY_HEADER]: API_KEY,
      ...data.getHeaders()
    },
    data,
    responseType: 'arraybuffer',
    onUploadProgress,
    onDownloadProgress
  } as AxiosRequestConfig<FormData>;
  try {
    const response = await axios.request(config);
    const { path: outputImagePath, cleanup } = await tmpFile({ prefix: 'rembg-', postfix: '.png' });
    fs.writeFileSync(outputImagePath, response.data);

    return { outputImagePath, cleanup };
  } catch (error) {
    console.error(error);
    return { outputImagePath: null, cleanup: null };
  }
}

export default rembg;
