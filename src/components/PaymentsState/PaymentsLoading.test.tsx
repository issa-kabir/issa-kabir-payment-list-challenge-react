import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import { PaymentsLoading } from './PaymentsLoading';

vi.mock('../components', () => ({
    Spinner: () => <div data-testid="spinner">Loading...</div>
}));

describe('PaymentsLoading', () => {
    test('renders the spinner component', () => {
        render(<PaymentsLoading />);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
});