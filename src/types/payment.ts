export interface Payment {
    id: string;
    customerName: string;
    amount: number;
    customerAddress: string;
    currency: string;
    status: "completed" | "pending" | "failed" | "refunded";
    date: string;
    description: string;
    clientId?: string;
}

export interface PaymentSearchResponse {
    payments: Payment[];
    total: number;
    page: number;
    pageSize: number;
}

export interface PaymentsFilters {
    search: string;
    currency: string;
    page: number;
    pageSize: number;
}