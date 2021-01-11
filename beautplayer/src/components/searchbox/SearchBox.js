import { React, useState } from 'react';
import './../commonstyles.scss';
import Styles from './SearchBox.module.scss';

import SearchIcon from './../../assets/buttonsvg/search.svg';

const SearchBox = props => {
    const [query, setQuery] = useState('');

    return (
        <div className={Styles.searchBoxWrapper}>
            <img data-dark-mode-compatible src={SearchIcon} alt="Search" />
            <input className={Styles.searchBox} type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
    );
};

export default SearchBox;