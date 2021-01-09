import React from 'react';
import Styles from './Navbar.module.scss';
import './../commonstyles.scss';

const Navbar = props => {
    return (
        <nav className={`${Styles.nav} acrylic`}>
            <button className={Styles.menuButton}>
                O
            </button>

            <div className={Styles.logo}>
                BeautPlayer
            </div>

            <span className={Styles.links}>
                Settings
            </span>
            <span className={Styles.links}>
                Home
            </span>
        </nav>
    );
};

export default Navbar;