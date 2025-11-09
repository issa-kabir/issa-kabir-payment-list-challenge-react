import { useState } from "react";
import { I18N } from "../constants/i18n";
import { FetchData } from "../hooks/FetchData";
import { PaymentsFilters } from "../types/payment";
import { PaymentsLoading } from "./PaymentsState/PaymentsLoading";
import { PaymentsError } from "./PaymentsState/PaymentsError";
import { PaymentsFilter } from "./PaymentsFilter";
import { Container, Table, TableWrapper, Title } from './components'
import { PaymentsTableHeader } from "./PaymentsTable/PaymentsTableHeader";
import { PaymentsEmptyTableRow } from "./PaymentsTable/PaymentsEmptyTableRow";
import { PaymentsTableRow } from "./PaymentsTable/PaymentsTableRow";
import { PaginationTableRow } from "./PaginationRow/PaginationTableRow";

export const PaymentsPage = () => {
  const [filters, setFilters] = useState<PaymentsFilters>({
    search: "",
    currency: "",
    page: 1,
    pageSize: 5,
  });

  const { data, isLoading, errorMessage } = FetchData(filters);

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

  return (
    <Container>
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
    </Container>
  );
};
