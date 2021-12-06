import { createContext } from 'react';

const SearchContext = createContext({
    searchTerm: '',
    setSearchTerm: () => {},
});

export default SearchContext;
