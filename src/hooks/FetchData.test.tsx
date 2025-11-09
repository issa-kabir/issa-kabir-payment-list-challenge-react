import "@testing-library/jest-dom";
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi, Mocked } from "vitest";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { FetchData } from './FetchData';
import { I18N } from '../constants/i18n';


vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('FetchData', () => {
    const mockFilters = {
        search: 'test',
        currency: 'USD',
        page: 1,
        pageSize: 10,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return data when request is successful', async () => {
        const mockData = { payments: [], total: 0 };
        mockedAxios.get.mockResolvedValue({ data: mockData });

        const { result } = renderHook(() => FetchData(mockFilters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.errorMessage).toBe('');
    });

    test('should return 404 error message when payment not found', async () => {
        mockedAxios.get.mockRejectedValue({
            isAxiosError: true,
            response: { status: 404 },
        });
        mockedAxios.isAxiosError.mockReturnValue(true);

        const { result } = renderHook(() => FetchData(mockFilters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(I18N.PAYMENT_NOT_FOUND);
        });
    });

    test('should return server error message for 500 status', async () => {
        mockedAxios.get.mockRejectedValue({
            isAxiosError: true,
            response: { status: 500 },
        });
        mockedAxios.isAxiosError.mockReturnValue(true);

        const { result } = renderHook(() => FetchData(mockFilters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(I18N.INTERNAL_SERVER_ERROR);
        });
    });

    test('should return generic error message for non-axios errors', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Network error'));
        mockedAxios.isAxiosError.mockReturnValue(false);

        const { result } = renderHook(() => FetchData(mockFilters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(I18N.SOMETHING_WENT_WRONG);
        });
    });

    test('should call API with correct parameters', async () => {
        mockedAxios.get.mockResolvedValue({ data: {} });

        renderHook(() => FetchData(mockFilters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining('search=test&currency=USD&page=1&pageSize=10')
            );
        });
    });
});