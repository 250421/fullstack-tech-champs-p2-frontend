// useAuth.test.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hook/useAuth';

import {jwtDecode} from 'jwt-decode';
import { axiosInstance } from '@/lib/axios-config';

// Mock all the external dependencies
jest.mock('@tanstack/react-query');
jest.mock('@/lib/axios-config');
jest.mock('jwt-decode');

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useAuth', () => {
  const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
  const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;
  const mockJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const createQueryResult = (data: any, isLoading = false, isError = false) => ({
    data,
    error: null,
    isError,
    isLoading,
    isSuccess: !isError && !isLoading,
    status: isLoading ? 'loading' : isError ? 'error' : 'success',
    isPending: isLoading,
    isFetching: false,
    isStale: false,
    isPlaceholderData: false,
    failureCount: 0,
    refetch: jest.fn(),
    remove: jest.fn(),
    fetchStatus: 'idle',
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isRefetching: false,
    isLoadingError: false,
    isPaused: false,
    isRefetchError: false,
    isInitialLoading: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
  });

  it('should return unauthenticated when no token exists', async () => {
    mockUseQuery.mockReturnValue(
      createQueryResult({
        isAuthenticated: false,
        user: null,
        userId: null,
        username: null
      })
    );

    const result = useAuth();
    expect(result.data).toEqual({
      isAuthenticated: false,
      user: null,
      userId: null,
      username: null
    });
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should return unauthenticated when token is expired', async () => {
    localStorage.setItem('token', 'expired-token');
    
    mockJwtDecode.mockReturnValue({
      userId: 1,
      userName: 'testuser',
      exp: Math.floor(Date.now() / 1000) - 1000, // Expired token
      iat: 0
    });

    mockUseQuery.mockReturnValue(
      createQueryResult({
        isAuthenticated: false,
        user: null,
        userId: null,
        username: null
      })
    );

    const result = useAuth();
    expect(result.data).toEqual({
      isAuthenticated: false,
      user: null,
      userId: null,
      username: null
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should return authenticated when token is valid', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const currentTime = Math.floor(Date.now() / 1000);
    localStorage.setItem('token', 'valid-token');
    
    mockJwtDecode.mockReturnValue({
      userId: 1,
      userName: 'testuser',
      exp: currentTime + 1000, // Future expiration
      iat: currentTime
    });

    mockAxiosInstance.get.mockResolvedValue({ data: mockUser });

    mockUseQuery.mockReturnValue(
      createQueryResult({
        isAuthenticated: true,
        user: mockUser,
        userId: 1,
        username: 'testuser'
      })
    );

    const result = useAuth();
    expect(result.data).toEqual({
      isAuthenticated: true,
      user: mockUser,
      userId: 1,
      username: 'testuser'
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/users/me');
  });

  it('should handle API errors and return unauthenticated', async () => {
    localStorage.setItem('token', 'valid-token');
    
    mockJwtDecode.mockReturnValue({
      userId: 1,
      userName: 'testuser',
      exp: Math.floor(Date.now() / 1000) + 1000,
      iat: 0
    });

    mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));

    mockUseQuery.mockReturnValue(
      createQueryResult({
        isAuthenticated: false,
        user: null,
        userId: null,
        username: null
      }, false, true)
    );

    const result = useAuth();
    expect(result.data).toEqual({
      isAuthenticated: false,
      user: null,
      userId: null,
      username: null
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should return loading state when query is loading', () => {
    mockUseQuery.mockReturnValue(
      createQueryResult(undefined, true)
    );

    const result = useAuth();
    expect(result.isLoading).toBe(true);
  });
});