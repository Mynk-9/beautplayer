import React, { useContext, useState, useEffect } from 'react';
import Styles from './Switcher.module.scss';
import './../commonstyles.scss';

import ThemeContext from './../themecontext';

const Switcher = ({ state, onChange, enabled = true }) => {
    const [enable, setEnable] = useState(state === true);
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);

    useEffect(() => {
        if (!letAcrylicTints) {
            setAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
        }
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '') {
                setAcrylicColorStyle({ '--acrylic-color': String(acrylicColor.slice(0, acrylicColor.length - 6) + ', 1)') });
            }
            else {
                setAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
            }
        }
    }, [acrylicColor, letAcrylicTints]);

    useEffect(() => {
        setEnable(state);
    }, [state]);

    return (
        <div className={Styles.switcherWrapper} data-enabled={enabled}>
            <div
                className={Styles.switcher}
                role={'button'}
                onClick={() => {
                    if (onChange && enabled)
                        onChange(!enable);
                }}
                data-enable={enable}
                style={acrylicColorStyle}
            >
                <div className={Styles.head} />
            </div>
            <span>
                {
                    enable
                        ? 'Enabled'
                        : 'Disabled'
                }
            </span>
        </div>
    );
};

export default Switcher;