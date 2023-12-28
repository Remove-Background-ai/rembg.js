import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import * as tmp from 'tmp-promise';

const { rembg } = require('./../index');

const mockAxios = new MockAdapter(axios);

jest.mock('tmp-promise', () => ({
  file: jest.fn().mockResolvedValue({ path: 'path/to/output.png', cleanup: jest.fn() })
}));

jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue("stream"),
  writeFileSync: jest.fn()
}));


describe('rembg', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should throw an error if apiKey is not provided', async () => {
    await expect(rembg({
      apiKey: '',
      inputImagePath: 'path/to/image.png',
    })).rejects.toThrowError('⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️: API key not provided, trials will be very limited.');
  });

  it('should return base64 image if returnBase64 is true', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('image data'),
    });

    const result = await rembg({
      apiKey: 'your-api-key',
      inputImagePath: 'path/to/image.png',
      returnBase64: true,
    });

    expect(result).toEqual({
      base64Image: 'data:image/png;base64,aW1hZ2UgZGF0YQ==',
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      responseType: 'arraybuffer',
    }));
  });

  it('should return output image path and cleanup function if returnBase64 is false', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('image data'),
    });
 
    const result = await rembg({
      apiKey: 'your-api-key',
      inputImagePath: 'path/to/image.png',
      returnBase64: false,
    });

    expect(result).toEqual({
      outputImagePath: 'path/to/output.png',
      cleanup: expect.any(Function),
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      responseType: 'arraybuffer',
    }));

    expect(tmp.file).toHaveBeenCalledWith(expect.objectContaining({
      prefix: 'rembg-',
      postfix: '.png',
    }));
    axiosMock.mockRestore();

  });

  it('should throw an error if the request fails', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockRejectedValueOnce({
      message: 'Request failed',
    });

    await expect(rembg({
      apiKey: 'your-api-key',
      inputImagePath: 'path/to/image.png',
    })).rejects.toThrowError('❌ Request failed');

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      responseType: 'arraybuffer',
    }));
  });

  it('should throw an error if the server responds with an error status code', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockRejectedValueOnce({
      response: {
        status: 500,
        data: 'Internal Server Error',
      },
    });

    await expect(rembg({
      apiKey: 'your-api-key',
      inputImagePath: 'path/to/image.png',
    })).rejects.toThrowError('❌ 500 Internal Server Error');

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      responseType: 'arraybuffer',
    }));
  });

  it('should throw an error if no response is received', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockRejectedValueOnce({
      request: {},
    });

    await expect(rembg({
      apiKey: 'your-api-key',
      inputImagePath: 'path/to/image.png',
    })).rejects.toThrowError();

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      responseType: 'arraybuffer',
    }));
  });

  // test if a request contains "x-api-key" header with the provided API key
  it('should send a request with the API key header', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('image data'),
    });

    await rembg({
      apiKey: 'your-api-key',
      inputImagePath: 'path/to/image.png',
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        'x-api-key': 'your-api-key',
      }),
    }));
  });

});