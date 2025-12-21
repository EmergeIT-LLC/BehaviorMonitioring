import { api } from '../../../src/lib/Api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes POST request with correct data', async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        data: { id: 1, name: 'Test' },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await api('post', '/test-endpoint', { name: 'Test' });

    expect(mockedAxios.post).toHaveBeenCalledWith('/test-endpoint', { name: 'Test' });
    expect(result).toEqual(mockResponse.data);
  });

  it('makes GET request correctly', async () => {
    const mockResponse = {
      data: {
        statusCode: 200,
        data: [{ id: 1 }, { id: 2 }],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await api('get', '/test-endpoint');

    expect(mockedAxios.get).toHaveBeenCalledWith('/test-endpoint');
    expect(result).toEqual(mockResponse.data);
  });

  it('handles API errors', async () => {
    const mockError = {
      response: {
        data: {
          statusCode: 400,
          errorMessage: 'Bad Request',
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(api('post', '/test-endpoint', {})).rejects.toEqual(mockError);
  });

  it('handles network errors', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(networkError);

    await expect(api('post', '/test-endpoint', {})).rejects.toThrow('Network Error');
  });
});
