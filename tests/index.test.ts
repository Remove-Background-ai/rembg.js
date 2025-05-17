import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import * as tmp from 'tmp-promise';
const FormData = require('form-data');
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
    jest.clearAllMocks();
  });

  it('should throw an error if apiKey is not provided', async () => {
    await expect(rembg({
      apiKey: '',
      inputImage: 'path/to/image.png',
    })).rejects.toThrowError('⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️: API key not provided, trials will be very limited.');
  });

  it('should return base64 image if returnBase64 is true', async () => {
    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('image data'),
    });

    const result = await rembg({
      apiKey: 'your-api-key',
      inputImage: 'path/to/image.png',
      options: {
        returnBase64: true,
      },
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
      inputImage: 'path/to/image.png',
      options: {
        returnBase64: false,
      },
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
      inputImage: 'path/to/image.png',
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
      inputImage: 'path/to/image.png',
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
      inputImage: 'path/to/image.png',
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
      inputImage: 'path/to/image.png',
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        'x-api-key': 'your-api-key',
      }),
    }));
  });
  it('should send a request with the mask field in the form data', async () => {
    // Spy on FormData.prototype.append
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    // Mock the axios request
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('image data'),
    });

    await rembg({
      apiKey: 'your-api-key',
      inputImage: 'path/to/image.png',
      onUploadProgress: () => {},
      onDownloadProgress: () => {},
      options: {
        returnMask: true,
        returnBase64: false
      },
    });

    // Check if FormData was called with the 'mask' field
    expect(appendSpy).toHaveBeenCalledWith('image', expect.anything());
    expect(appendSpy).toHaveBeenCalledWith('mask', 'true');

    // Check axiosMock to be called with FormData
    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.any(FormData),
    }));

    // Restore mocks
    jest.restoreAllMocks();
  });

  it('should handle buffer input', async () => {
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('processed image data'),
    });

    const inputBuffer = Buffer.from('input image data');

    // Mock FormData
    const mockAppend = jest.fn();
    jest.spyOn(FormData.prototype, 'append').mockImplementation(mockAppend);

    const result = await rembg({
      apiKey: 'your-api-key',
      inputImage: inputBuffer,
    });

    expect(result).toEqual({
      outputImagePath: 'path/to/output.png',
      cleanup: expect.any(Function),
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.any(FormData),
    }));

    // Check if the FormData.append was called with the correct arguments
    expect(mockAppend).toHaveBeenCalledWith('image', inputBuffer, { filename: 'image.png' });


    axiosMock.mockRestore();
  });


  // New tests for base64 input
  it('should handle base64 input', async () => {
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('processed image data'),
    });

    const base64Input = { base64: 'aW5wdXQgaW1hZ2UgZGF0YQ==' }; // "input image data" in base64

    const result = await rembg({
      apiKey: 'your-api-key',
      inputImage: base64Input,
    });

    expect(result).toEqual({
      outputImagePath: 'path/to/output.png',
      cleanup: expect.any(Function),
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.any(FormData),
    }));

    // Check if the FormData was created with the buffer from base64
    const formDataAppendSpy = jest.spyOn(FormData.prototype, 'append');
    expect(formDataAppendSpy).toHaveBeenCalledWith(
      'image', 
      expect.any(Buffer), 
      { filename: 'image.png', contentType: "image/png"},
    );

    axiosMock.mockRestore();
    formDataAppendSpy.mockRestore();
  });

  // Test for invalid input type
  it('should throw an error for invalid input type', async () => {
    await expect(rembg({
      apiKey: 'your-api-key',
      inputImage: 123, // Invalid input type
    })).rejects.toThrowError('Invalid input type. Must be a file path, Buffer, or an object with a base64 property.');
  });

  // Update existing tests to use 'input' instead of 'inputImage'
  it('should return base64 image if returnBase64 is true', async () => {
    const axiosMock = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: Buffer.from('image data'),
    });

    const result = await rembg({
      apiKey: 'your-api-key',
      inputImage: 'path/to/image.png',
      options: {
        returnBase64: true,
      },

    });

    expect(result).toEqual({
      base64Image: 'data:image/png;base64,aW1hZ2UgZGF0YQ==',
    });

    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      responseType: 'arraybuffer',
    }));

    axiosMock.mockRestore();
  });


});