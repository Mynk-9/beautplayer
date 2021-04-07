import { React, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './../searchbox/SearchBox';
import ColorModeSwitch from './../../components/colormodeswitch/ColorModeSwitch';
import './../commonstyles.scss';
import Styles from './Navbar.module.scss';

import ThemeContext from './../themecontext';

import UpArrowIcon from './../../assets/buttonsvg/chevron-up.svg';
import DownArrowIcon from './../../assets/buttonsvg/chevron-down.svg';

const Navbar = props => {
    const [navOpen, setNavOpen] = useState(false);
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);

    useEffect(() => {
        if (!letAcrylicTints)
            setAcrylicColorStyle({});
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '')
                setAcrylicColorStyle({ '--acrylic-color': acrylicColor })
            else
                setAcrylicColorStyle({});
        }
    }, [acrylicColor, letAcrylicTints]);

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
                <span className={"cursor-pointer"}>
                    <Link to={`/`}>BeautPlayer</Link>
                </span>
            </span>
            <span className={Styles.right}>
                <SearchBox />
            </span>
            <span className={Styles.right}>
                <span className={"cursor-pointer"}>
                    <Link to={`/`}>Home</Link>
                </span>
            </span>
            <span className={Styles.right}>
                <span className={"cursor-pointer"}>
                    <Link to={`/settings`}>Settings</Link>
                </span>
            </span>
            <span className={Styles.right}>
                <span className={"cursor-pointer"}>
                    <Link to={`/queue`}>Queue</Link>
                </span>
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