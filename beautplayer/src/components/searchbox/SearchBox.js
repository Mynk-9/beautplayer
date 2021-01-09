import { React, useState } from 'react';
import Styles from './SearchBox.module.scss';
import './../commonstyles.scss';

import SearchIcon from './../../assets/buttonsvg/search.svg';

const SearchBox = props => {
    const [query, setQuery] = useState('');

    return (
        <div className={Styles.searchBoxWrapper}>
            <img src={SearchIcon} />
            <input className={Styles.searchBox} type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
    );
};

export default SearchBox;