import { I18N } from '../../constants/i18n';
import { TableRow, TableCell, EmptyBox, TableBodyWrapper } from '../components';

export const PaymentsEmptyTableRow = () => {
    return (
        <TableBodyWrapper>
            <TableRow>
                <TableCell colSpan={6}>
                    <EmptyBox>
                        {I18N.NO_PAYMENTS_FOUND}
                    </EmptyBox>
                </TableCell>
            </TableRow>
        </TableBodyWrapper>
    );
};
