import { I18N } from "../../constants/i18n"
import { CURRENCIES } from "../../constants"
import { FlexRow, FilterRow, SearchInput, Select, SearchButton, ClearButton } from "../components"

interface PaymentsFilterProps {
    searchInput: string;
    setSearchInput: (value: string) => void;
    currencyInput: string;
    setCurrencyInput: (value: string) => void;
    handleSearch: () => void;
    handleClearFilters: () => void;
    hasActiveFilters: boolean;
}

export const PaymentsFilter = ({ searchInput, setSearchInput, currencyInput, setCurrencyInput, handleSearch, handleClearFilters, hasActiveFilters }: PaymentsFilterProps) => {
    return (
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
    )
}
