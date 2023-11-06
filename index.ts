import * as fs from 'fs';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { file as tmpFile } from 'tmp-promise';
import { Buffer } from 'buffer';

export const rembg = async ({
  apiKey,
  inputImagePath,
  onUploadProgress = console.log, // it will log every uploadProgress event by default
  onDownloadProgress = console.log, // it will log every uploadProgress event by default
  returnBase64 = false, // by default, it won't return a Base64 string
}: {
  apiKey: string;
  inputImagePath: string;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void;
  returnBase64: boolean
}) => {
  if (!apiKey) console.error(' ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️: API key not provided, trials will be very limited.');

  const url = "https://api.remove-background.ai/rmbg";
  const API_KEY_HEADER = "c2c299ab-39c4-47c7-b447-6c2a334ab806";

  const data = new FormData();
  data.append('image', fs.createReadStream(inputImagePath));


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
