import { I18N } from '../../constants/i18n'
import { PaginationRow, PaginationButton } from '../components'
import { PaymentSearchResponse, PaymentsFilters } from '../../types/payment'

interface PaginationTableRowProps {
    data: PaymentSearchResponse;
    setFilters: (filters: PaymentsFilters) => void;
    filters: PaymentsFilters;
}

export const PaginationTableRow = ({ data, setFilters, filters }: PaginationTableRowProps) => {
    const totalPages = data ? Math.ceil(data.total / filters.pageSize) : 1;
    const canGoToPrevious = filters.page > 1;
    const canGoToNext = filters.page < totalPages;

    const handleNextPage = () => {
        setFilters({
            ...filters,
            page: Math.min(totalPages, filters.page + 1)
        });
    }

    const handlePreviousPage = () => {
        setFilters({
            ...filters,
            page: Math.max(1, filters.page - 1)
        });
    }

    return (
        <>
            {data.payments.length > 0 && totalPages > 1 && (
                <PaginationRow>
                    <PaginationButton
                        onClick={handlePreviousPage}
                        disabled={!canGoToPrevious}
                    >
                        {I18N.PREVIOUS_BUTTON}
                    </PaginationButton>
                    <span>
                        {I18N.PAGE_LABEL} {filters.page}
                    </span>
                    <PaginationButton
                        onClick={handleNextPage}
                        disabled={!canGoToNext}
                    >
                        {I18N.NEXT_BUTTON}
                    </PaginationButton>
                </PaginationRow>
            )}
        </>
    )
}