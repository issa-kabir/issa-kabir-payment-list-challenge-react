import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { PaymentSearchResponse, PaymentsFilters } from "../types/payment";
import { I18N } from "../constants/i18n";

interface FetchDataResult {
    data?: PaymentSearchResponse;
    isLoading: boolean;
    errorMessage: string;
}

const fetchPayments = async (filters: PaymentsFilters): Promise<PaymentSearchResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.currency) params.append('currency', filters.currency);
    params.append('page', filters.page.toString());
    params.append('pageSize', filters.pageSize.toString());

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
};

export const FetchData = (filters: PaymentsFilters): FetchDataResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['payments', filters],
        queryFn: () => fetchPayments(filters),
    });

    let errorMessage: string = '';
    if (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                errorMessage = I18N.PAYMENT_NOT_FOUND;
            } else if (error.response?.status === 500) {
                errorMessage = I18N.INTERNAL_SERVER_ERROR;
            } else {
                errorMessage = I18N.SOMETHING_WENT_WRONG;
            }
        } else {
            errorMessage = I18N.SOMETHING_WENT_WRONG;
        }
    }

    return { data, isLoading, errorMessage };
} 