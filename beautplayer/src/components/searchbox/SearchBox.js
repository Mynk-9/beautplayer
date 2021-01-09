import { React, useState } from 'react';
import Styles from './SearchBox.module.scss';
import './../commonstyles.scss';

const SearchBox = props => {
    const [query, setQuery] = useState('');

    return (
        <input className={Styles.searchBox} type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
    );
};

export default SearchBox;