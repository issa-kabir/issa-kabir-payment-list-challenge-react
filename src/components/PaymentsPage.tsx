import React, { useState } from "react";
import axios from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { I18N } from "../constants/i18n";
import { ClearButton, Container, ErrorBox, FilterRow, FlexRow, SearchButton, SearchInput, Select, Spinner, Table, TableWrapper, Title } from './components'
import { PaymentSearchResponse, PaymentsFilters } from "../types/payment";
import { PaymentTableHeader } from "./PaymentTable/PaymentTableHeader";
import { PaymentEmptyTableRow } from "./PaymentTable/PaymentEmptyTableRow";
import { PaymentTableRow } from "./PaymentTable/PaymentTableRow";
import { API_URL, CURRENCIES } from "../constants";
import { PaginationTableRow } from "./PaginationRow/PaginationTableRow";

const fetchPayments = async (filters: PaymentsFilters): Promise<PaymentSearchResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.currency) params.append('currency', filters.currency);
  params.append('page', filters.page.toString());
  params.append('pageSize', filters.pageSize.toString());

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  if (response.status !== 200) {
    // Add log here
    throw new Error("Network response was not ok");
  }
  // Add log here
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
    placeholderData: keepPreviousData
  });

  let errorMessage = '';
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

  const hasActiveFilters = filters.search || filters.currency;

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
  }


  return <Container>
    <Title>{I18N.PAGE_TITLE}</Title>

    <FlexRow>
      <FilterRow>
        <SearchInput
          type="text"
          placeholder={I18N.SEARCH_PLACEHOLDER}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label={I18N.SEARCH_LABEL}
        />
        <Select
          value={currencyInput}
          onChange={(e) => setCurrencyInput(e.target.value)}
          aria-label={I18N.CURRENCY_FILTER_LABEL}
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <SearchButton onClick={handleSearch}>
          {I18N.SEARCH_BUTTON}
        </SearchButton>
      </FilterRow>
      {hasActiveFilters && (
        <ClearButton onClick={handleClearFilters}>
          {I18N.CLEAR_FILTERS}
        </ClearButton>
      )}
    </FlexRow>

    {isLoading && (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Spinner />
      </div>
    )}

    {errorMessage && (
      <ErrorBox>
        {errorMessage}
      </ErrorBox>
    )}

    {!isLoading && !errorMessage && data && (
      <TableWrapper>
        <Table>
          <PaymentTableHeader />
          {data.payments.length === 0 ? (
            <PaymentEmptyTableRow />
          ) : (
            <PaymentTableRow {...data} />
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
