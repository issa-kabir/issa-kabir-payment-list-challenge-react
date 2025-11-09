import { render, screen } from '@testing-library/react'
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import { I18N } from '../../constants/i18n'
import { PaymentsTableHeader } from './PaymentsTableHeader'

describe('PaymentsTableHeader', () => {
    test('renders all table headers', () => {
        render(<PaymentsTableHeader />)

        expect(screen.getByText(I18N.TABLE_HEADER_PAYMENT_ID)).toBeInTheDocument()
        expect(screen.getByText(I18N.TABLE_HEADER_DATE)).toBeInTheDocument()
        expect(screen.getByText(I18N.TABLE_HEADER_AMOUNT)).toBeInTheDocument()
        expect(screen.getByText(I18N.TABLE_HEADER_CUSTOMER)).toBeInTheDocument()
        expect(screen.getByText(I18N.TABLE_HEADER_CURRENCY)).toBeInTheDocument()
        expect(screen.getByText(I18N.TABLE_HEADER_STATUS)).toBeInTheDocument()
    })

    test('renders correct number of table headers', () => {
        render(<PaymentsTableHeader />)

        const headers = screen.getAllByRole('columnheader')
        expect(headers).toHaveLength(6)
    })
})