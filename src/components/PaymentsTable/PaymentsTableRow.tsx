import { I18N } from '../../constants/i18n'
import { format } from 'date-fns/format';
import { TableRow, TableCell, StatusBadge, TableBodyWrapper } from '../components'
import { Payment, PaymentSearchResponse } from '../../types/payment'

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: 2,

    }).format(amount);
};

const formatDate = (dateString: string): string => {
    const formattedDate = format(new Date(dateString), 'dd/MM/yyyy, HH:mm:ss');
    return formattedDate;
};

export const PaymentsTableRow = (data: PaymentSearchResponse) => {
    return (
        <TableBodyWrapper>
            {data.payments.map((payment: Payment) => (
                <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{formatAmount(payment.amount)}</TableCell>
                    <TableCell>{payment.customerName || I18N.EMPTY_CUSTOMER}</TableCell>
                    <TableCell>{payment.currency || I18N.EMPTY_CURRENCY}</TableCell>
                    <TableCell>
                        <StatusBadge $status={payment.status}>
                            {payment.status}
                        </StatusBadge>
                    </TableCell>
                </TableRow>
            ))}
        </TableBodyWrapper>
    )
}