import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { I18N } from '../constants/i18n';
import { CURRENCIES } from '../constants';
import { PaymentsFilter } from './PaymentsFilter';

describe('PaymentsFilter', () => {
    const mockProps = {
        searchInput: '',
        setSearchInput: vi.fn(),
        currencyInput: '',
        setCurrencyInput: vi.fn(),
        handleSearch: vi.fn(),
        handleClearFilters: vi.fn(),
        hasActiveFilters: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders search input with correct placeholder and aria-label', () => {
        render(<PaymentsFilter {...mockProps} />);

        const searchInput = screen.getByPlaceholderText(I18N.SEARCH_PLACEHOLDER);
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('aria-label', I18N.SEARCH_LABEL);
    });

    test('renders currency select with all currency options', () => {
        render(<PaymentsFilter {...mockProps} />);

        const select = screen.getByLabelText(I18N.CURRENCY_FILTER_LABEL);
        expect(select).toBeInTheDocument();

        const defaultOption = screen.getByText(I18N.CURRENCIES_OPTION);
        expect(defaultOption).toBeInTheDocument();

        CURRENCIES.forEach((currency) => {
            expect(screen.getByText(currency)).toBeInTheDocument();
        });
    });

    test('calls setSearchInput when search input changes', () => {
        render(<PaymentsFilter {...mockProps} />);

        const searchInput = screen.getByPlaceholderText(I18N.SEARCH_PLACEHOLDER);
        fireEvent.change(searchInput, { target: { value: 'test search' } });

        expect(mockProps.setSearchInput).toHaveBeenCalledWith('test search');
    });

    test('calls setCurrencyInput when currency select changes', () => {
        render(<PaymentsFilter {...mockProps} />);

        const select = screen.getByLabelText(I18N.CURRENCY_FILTER_LABEL);
        fireEvent.change(select, { target: { value: 'USD' } });

        expect(mockProps.setCurrencyInput).toHaveBeenCalledWith('USD');
    });

    test('calls handleSearch when search button is clicked', () => {
        render(<PaymentsFilter {...mockProps} />);

        const searchButton = screen.getByText(I18N.SEARCH_BUTTON);
        fireEvent.click(searchButton);

        expect(mockProps.handleSearch).toHaveBeenCalled();
    });

    test('shows clear button when hasActiveFilters is true', () => {
        render(<PaymentsFilter {...mockProps} hasActiveFilters={true} />);

        const clearButton = screen.getByText(I18N.CLEAR_FILTERS);
        expect(clearButton).toBeInTheDocument();
    });

    test('hides clear button when hasActiveFilters is false', () => {
        render(<PaymentsFilter {...mockProps} hasActiveFilters={false} />);

        const clearButton = screen.queryByText(I18N.CLEAR_FILTERS);
        expect(clearButton).not.toBeInTheDocument();
    });

    test('calls handleClearFilters when clear button is clicked', () => {
        render(<PaymentsFilter {...mockProps} hasActiveFilters={true} />);

        const clearButton = screen.getByText(I18N.CLEAR_FILTERS);
        fireEvent.click(clearButton);

        expect(mockProps.handleClearFilters).toHaveBeenCalled();
    });

    test('displays current search input value', () => {
        render(<PaymentsFilter {...mockProps} searchInput="current search" />);

        const searchInput = screen.getByDisplayValue('current search');
        expect(searchInput).toBeInTheDocument();
    });

    test('displays current currency input value', () => {
        render(<PaymentsFilter {...mockProps} currencyInput="EUR" />);

        const select = screen.getByDisplayValue('EUR');
        expect(select).toBeInTheDocument();
    });
});