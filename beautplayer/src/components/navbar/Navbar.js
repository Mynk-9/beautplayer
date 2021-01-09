import React from 'react';
import Styles from './Navbar.module.scss';
import './../commonstyles.scss';

import SearchBox from './../searchbox/SearchBox';

const Navbar = props => {
    return (
        <nav className={`${Styles.nav} acrylic`}>
            <div className={Styles.center}>
                BeautPlayer
            </div>
            <SearchBox />
            <span className={Styles.right}>
                Home
            </span>
            <span className={Styles.right}>
                Settings
            </span>
        </nav>
    );
};

export default Navbar;