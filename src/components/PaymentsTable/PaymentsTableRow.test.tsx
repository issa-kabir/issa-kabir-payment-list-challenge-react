import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import { I18N } from '../../constants/i18n';
import { PaymentsTableRow } from './PaymentsTableRow';
import { PaymentSearchResponse } from '../../types/payment';

const mockPaymentData: PaymentSearchResponse = {
    payments: [
        {
            id: 'payment-1',
            date: '2025-11-09T14:30:00Z',
            amount: 123.00,
            customerName: 'Customer One',
            currency: 'GBP',
            status: "completed",
            customerAddress: 'Some Address 123',
            description: 'Payment description',
        },
        {
            id: 'payment-2',
            date: '2025-11-09T20:50:00Z',
            amount: 123.45,
            customerName: 'Customer Two',
            currency: 'USD',
            status: "pending",
            customerAddress: 'Some Address 123',
            description: 'Payment description'
        }
    ],
    total: 2,
    page: 1,
    pageSize: 5
};

describe('PaymentsTableRow', () => {
    test('renders correct number of rows', () => {
        render(<PaymentsTableRow {...mockPaymentData} />);

        expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    test('renders multiple payments', () => {
        render(<PaymentsTableRow {...mockPaymentData} />);

        expect(screen.getByText('payment-1')).toBeInTheDocument();
        expect(screen.getByText('payment-2')).toBeInTheDocument();
    });

    test('renders payment data correctly', () => {
        render(<PaymentsTableRow {...mockPaymentData} />);

        expect(screen.getByText('payment-1')).toBeInTheDocument();
        expect(screen.getByText('09/11/2025, 14:30:00')).toBeInTheDocument();
        expect(screen.getByText('123.00')).toBeInTheDocument();
        expect(screen.getByText('Customer One')).toBeInTheDocument();
        expect(screen.getByText('GBP')).toBeInTheDocument();
        expect(screen.getByText('completed')).toBeInTheDocument();
    });

    test('handles empty customer name with fallback text', () => {
        const singlePayment: PaymentSearchResponse = {
            payments: [{
                id: 'payment-3',
                date: '2025-11-09T14:30:00Z',
                amount: 100,
                customerName: '',
                currency: 'USD',
                status: 'failed',
                customerAddress: 'Some Address 123',
                description: 'Payment description'
            }],
            total: 1,
            page: 1,
            pageSize: 5
        };
        render(<PaymentsTableRow {...singlePayment} />);

        expect(screen.getByText(I18N.EMPTY_CUSTOMER)).toBeInTheDocument();
    });

    test('handles empty currency with fallback text', () => {
        const singlePayment: PaymentSearchResponse = {
            payments: [{
                id: 'payment-3',
                date: '2025-11-09T14:30:00Z',
                amount: 100,
                customerName: 'Customer Three',
                currency: '',
                status: 'failed',
                customerAddress: 'Some Address 123',
                description: 'Payment description'
            }],
            total: 1,
            page: 1,
            pageSize: 5
        };
        render(<PaymentsTableRow {...singlePayment} />);

        expect(screen.getByText(I18N.EMPTY_CURRENCY)).toBeInTheDocument();
    });
});