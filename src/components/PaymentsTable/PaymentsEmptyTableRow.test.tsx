import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import { I18N } from '../../constants/i18n';
import { PaymentsEmptyTableRow } from './PaymentsEmptyTableRow';

describe('PaymentsEmptyTableRow', () => {
    test('renders empty state message', () => {
        render(<PaymentsEmptyTableRow />);
        expect(screen.getByText(I18N.NO_PAYMENTS_FOUND)).toBeInTheDocument();
    });
});