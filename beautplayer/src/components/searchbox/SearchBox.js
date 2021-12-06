import { React, useState, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Styles from './SearchBox.module.scss';
import './../commonstyles.scss';

import SearchContext from './../searchcontext';

import SearchIcon from './../../assets/buttonsvg/search.svg';

const SearchBox = props => {
    const [query, setQuery] = useState('');
    const { searchTerm, setSearchTerm } = useContext(SearchContext);

    let history = useHistory();
    let location = useLocation();

    const handleInput = e => {
        if (!e) return; // error check

        let keyCode = e.code || e.key;
        if (keyCode === 'Enter') {
            // check if enter pressed
            e.target.blur(); // lose focus on the search box

            const val = e.target.value.trim(); // trim the input
            if (!val || val === '') {
                // query removed
                // check if we are in search page
                // if yes, navigate back
                // then change context
                if (location.pathname === '/search') history.goBack();
                setSearchTerm('');
            } else if (val !== searchTerm) {
                // query changed
                // then set the context
                // check if we are in search page
                // if not then navigate to search page
                setSearchTerm(val);
                if (location.pathname !== '/search') history.push('/search');
            }
            // do nothing if query is unchanged
        }
    };

    // set query text on context change
    useEffect(() => setQuery(searchTerm), [searchTerm]);

    return (
        <div className={Styles.searchBoxWrapper}>
            <img data-dark-mode-compatible src={SearchIcon} alt="Search" />
            <input
                className={Styles.searchBox}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={handleInput}
            />
        </div>
    );
};

export default SearchBox;
