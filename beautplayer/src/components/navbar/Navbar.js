import { React, useState } from 'react';
import Styles from './Navbar.module.scss';
import './../commonstyles.scss';
import SearchBox from './../searchbox/SearchBox';

import UpArrowIcon from './../../assets/buttonsvg/chevron-up.svg';
import DownArrowIcon from './../../assets/buttonsvg/chevron-down.svg';

const Navbar = props => {
    const [navOpen, setNavOpen] = useState(false);

    let acrylicColorStyle;
    if (props.acrylicColor)
        acrylicColorStyle = { '--acrylic-color': props.acrylicColor };
    else
        acrylicColorStyle = {};

    return (
        <nav
            className={`${Styles.nav} acrylic`}
            data-nav-state={
                navOpen
                    ? 'open'
                    : 'close'
            }
            style={acrylicColorStyle}
        >
            <div className={Styles.center}>
                BeautPlayer
            </div>
            <span className={Styles.right}>
                <SearchBox />
            </span>
            <span className={Styles.right}>
                Home
            </span>
            <span className={Styles.right}>
                Settings
            </span>
            <button
                className={Styles.openNav}
                onClick={() => {
                    if (navOpen) {
                        setNavOpen(false);

                    } else {
                        setNavOpen(true);
                    }
                }}
            >
                <img
                    alt="Toggle"
                    src={
                        navOpen
                            ? UpArrowIcon
                            : DownArrowIcon
                    }
                />
            </button>
        </nav>
    );
};

export default Navbar;