import { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { I18N } from "../constants/i18n";
import { useQuery } from "@tanstack/react-query";
import { Container, Table, TableWrapper, Title } from './components'
import { PaymentSearchResponse, PaymentsFilters } from "../types/payment";
import { PaymentsLoading } from "./PaymentsLoading";
import { PaymentsError } from "./PaymentsError";
import { PaymentsFilter } from "./PaymentsFilter";
import { PaymentsTableHeader } from "./PaymentsTable/PaymentsTableHeader";
import { PaymentsEmptyTableRow } from "./PaymentsTable/PaymentsEmptyTableRow";
import { PaymentsTableRow } from "./PaymentsTable/PaymentsTableRow";
import { PaginationTableRow } from "./PaginationRow/PaginationTableRow";

const fetchPayments = async (filters: PaymentsFilters): Promise<PaymentSearchResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.currency) params.append('currency', filters.currency);
  params.append('page', filters.page.toString());
  params.append('pageSize', filters.pageSize.toString());

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

export const PaymentsPage = () => {
  const [filters, setFilters] = useState<PaymentsFilters>({
    search: "",
    currency: "",
    page: 1,
    pageSize: 5,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', filters],
    queryFn: () => fetchPayments(filters),
  });

  let errorMessage: string = '';
  if (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        errorMessage = I18N.PAYMENT_NOT_FOUND;
      } else if (error.response?.status === 500) {
        errorMessage = I18N.INTERNAL_SERVER_ERROR;
      } else {
        errorMessage = I18N.SOMETHING_WENT_WRONG;
      }
    } else {
      errorMessage = I18N.SOMETHING_WENT_WRONG;
    }
  }

  const [searchInput, setSearchInput] = useState<string>("");
  const [currencyInput, setCurrencyInput] = useState<string>("");

  const hasActiveFilters: boolean = Boolean(filters.search || filters.currency);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchInput,
      currency: currencyInput,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setCurrencyInput("");
    setFilters({
      ...filters,
      search: '',
      currency: '',
      page: 1
    });
  };

  return <Container>
    <Title>{I18N.PAGE_TITLE}</Title>

    <PaymentsFilter
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      currencyInput={currencyInput}
      setCurrencyInput={setCurrencyInput}
      handleSearch={handleSearch}
      handleClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
    />

    {isLoading && (<PaymentsLoading />)}

    {errorMessage && (<PaymentsError errorMessage={errorMessage} />)}

    {!isLoading && !errorMessage && data && (
      <TableWrapper>
        <Table>
          <PaymentsTableHeader />
          {data.payments.length === 0 ? (
            <PaymentsEmptyTableRow />
          ) : (
            <PaymentsTableRow {...data} />
          )}
        </Table>
        <PaginationTableRow
          data={data}
          setFilters={setFilters}
          filters={filters}
        />
      </TableWrapper>
    )}
  </Container>;
};
