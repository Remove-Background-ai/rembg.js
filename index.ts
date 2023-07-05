import * as fs from 'fs';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { file as tmpFile } from 'tmp-promise';

export const rembg = async ({
  apiKey,
  inputImagePath,
  onUploadProgress = console.log, // it will log every uploadProgress event by default
  onDownloadProgress = console.log // it will log every uploadProgress event by default
}: {
    apiKey: string;
  inputImagePath: string;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void;
}) => {
  if (!apiKey) throw new Error('API key is required');

  const url = "https://api.remove-background.ai/rmbg";
  const API_KEY_HEADER = "x-api-key";

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
    const { path: outputImagePath, cleanup } = await tmpFile({ prefix: 'rembg-', postfix: '.png' });
    fs.writeFileSync(outputImagePath, response.data);

    return { outputImagePath, cleanup };
  } catch (error) {
    console.error(error);
    return { outputImagePath: null, cleanup: null };
  }
}

export default rembg;
