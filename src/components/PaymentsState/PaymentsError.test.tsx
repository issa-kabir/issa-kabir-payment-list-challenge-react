import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import { PaymentsError } from './PaymentsError';

vi.mock('../components', () => ({
    ErrorBox: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="error-box">{children}</div>
    ),
}));

describe('PaymentsError', () => {
    test('renders error message correctly', () => {
        const errorMessage = 'Something went wrong';
        render(<PaymentsError errorMessage={errorMessage} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('renders ErrorBox component correctly', () => {
        render(<PaymentsError errorMessage="Test error" />);

        expect(screen.getByTestId('error-box')).toBeInTheDocument();
    });

    test('passes error message to ErrorBox', () => {
        const errorMessage = 'Network error occurred';
        render(<PaymentsError errorMessage={errorMessage} />);

        const errorBox = screen.getByTestId('error-box');
        expect(errorBox).toHaveTextContent(errorMessage);
    });
});