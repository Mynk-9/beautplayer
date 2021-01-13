import { React, useState } from 'react';
import SearchBox from './../searchbox/SearchBox';
import ColorModeSwitch from './../../components/colormodeswitch/ColorModeSwitch';
import './../commonstyles.scss';
import Styles from './Navbar.module.scss';

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
            <span className={Styles.center}>
                <span className={"cursor-pointer"}>BeautPlayer</span>
            </span>
            <span className={Styles.right}>
                <SearchBox />
            </span>
            <span className={Styles.right}>
                <span className={"cursor-pointer"}>Home</span>
            </span>
            <span className={Styles.right}>
                <span className={"cursor-pointer"}>Settings</span>
            </span>
            <span className={Styles.right}>
                <ColorModeSwitch />
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
                <img data-dark-mode-compatible
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