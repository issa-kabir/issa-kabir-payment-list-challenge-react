import { render, screen, fireEvent } from '@testing-library/react'
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { I18N } from '../../constants/i18n'
import { Payment } from '../../types/payment';
import { PaginationTableRow } from './PaginationTableRow'

const mockSetFilters = vi.fn()

const mockData = {
    payments: [{ id: '1' } as Payment, { id: '2' } as Payment],
    total: 2,
    page: 1,
    pageSize: 1
}

const defaultFilters = {
    search: '',
    currency: '',
    page: 1,
    pageSize: 1
}

describe('PaginationTableRow', () => {
    beforeEach(() => {
        mockSetFilters.mockClear()
    })

    test('does not render anything when no payments in data', () => {
        const { container } = render(
            <PaginationTableRow
                data={{ payments: [], total: 0, page: 1, pageSize: 5 }}
                setFilters={mockSetFilters}
                filters={defaultFilters}
            />
        )
        expect(container.firstChild).toBeNull()
    })

    test('does not render anything when only one page to display', () => {
        const { container } = render(
            <PaginationTableRow
                data={{ ...mockData, total: 1, pageSize: 5 }}
                setFilters={mockSetFilters}
                filters={defaultFilters}
            />
        )
        expect(container.firstChild).toBeNull()
    })

    test('renders pagination when multiple pages', () => {
        render(
            <PaginationTableRow
                data={mockData}
                setFilters={mockSetFilters}
                filters={defaultFilters}
            />
        )

        expect(screen.getByText(I18N.PREVIOUS_BUTTON)).toBeInTheDocument()
        expect(screen.getByText(I18N.NEXT_BUTTON)).toBeInTheDocument()
        expect(screen.getByText(`${I18N.PAGE_LABEL} 1`)).toBeInTheDocument()
    })

    test('disables previous button on first page', () => {
        render(
            <PaginationTableRow
                data={mockData}
                setFilters={mockSetFilters}
                filters={defaultFilters}
            />
        )

        expect(screen.getByText(I18N.PREVIOUS_BUTTON)).toBeDisabled()
    })

    test('disables next button on last page', () => {
        render(
            <PaginationTableRow
                data={mockData}
                setFilters={mockSetFilters}
                filters={{ ...defaultFilters, page: 2 }}
            />
        )

        expect(screen.getByText(I18N.NEXT_BUTTON)).toBeDisabled()
    })

    test('calls setFilters with next page when next button clicked', () => {
        render(
            <PaginationTableRow
                data={mockData}
                setFilters={mockSetFilters}
                filters={defaultFilters}
            />
        )

        fireEvent.click(screen.getByText(I18N.NEXT_BUTTON))
        expect(mockSetFilters).toHaveBeenCalledWith({ ...defaultFilters, page: 2 })
    })

    test('calls setFilters with previous page when previous button clicked', () => {
        render(
            <PaginationTableRow
                data={mockData}
                setFilters={mockSetFilters}
                filters={{ ...defaultFilters, page: 2 }}
            />
        )

        fireEvent.click(screen.getByText(I18N.PREVIOUS_BUTTON))
        expect(mockSetFilters).toHaveBeenCalledWith({ ...defaultFilters, page: 1 })
    })
})