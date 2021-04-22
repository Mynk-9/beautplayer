import { React, useContext } from 'react';
import './../commonstyles.scss';
import Styles from './ColorModeSwitch.module.scss';
import SunIcon from './../../assets/buttonsvg/sun.svg';
import MoonIcon from './../../assets/buttonsvg/moon.svg';

import ThemeContext from "./../themecontext";

const ColorModeSwitch = props => {
    // const [colorConfig, setColorConfig] = useState('dark');
    const { colorConfig, setColorConfig } = useContext(ThemeContext);

    let getColorMode = () => document.body.classList.contains('light-mode');
    let setColorMode = e => {
        if (e) {
            document.body.classList.add('light-mode');
            setColorConfig('light');
        }
        else {
            document.body.classList.remove('light-mode');
            setColorConfig('dark');
        }
    };

    return (
        <button className={`${Styles.button} cursor-pointer`} onClick={
            () => setColorMode(!getColorMode())
        }>
            <img data-dark-mode-compatible
                alt="Toggle Color Mode"
                src={
                    colorConfig === 'dark'
                        ? SunIcon
                        : MoonIcon
                }
            />
        </button>
    );
}

export default ColorModeSwitch;