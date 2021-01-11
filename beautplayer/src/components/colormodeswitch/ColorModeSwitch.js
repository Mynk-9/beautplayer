import { React, useState } from 'react';
import './../commonstyles.scss';
import Styles from './ColorModeSwitch.module.scss';
import SunIcon from './../../assets/buttonsvg/sun.svg';
import MoonIcon from './../../assets/buttonsvg/moon.svg';

const ColorModeSwitch = props => {
    const [colorConfig, setColorConfig] = useState('light');

    let getColorMode = () => document.body.classList.contains('dark-mode');
    let setColorMode = e => {
        console.log(getColorMode(), e);
        if (e) {
            document.body.classList.add('dark-mode');
            setColorConfig('dark');
        }
        else {
            document.body.classList.remove('dark-mode');
            setColorConfig('light');
        }
    };

    return (
        <button className={Styles.button} onClick={
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