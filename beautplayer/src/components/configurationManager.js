import { useEffect, useContext } from 'react';

import ThemeContext from './themecontext';
import PlayerContext from './playercontext';

const ConfigurationLoader = () => {
    const { letAcrylicTints, colorConfig,
        setLetAcrylicTints, setColorConfig } = useContext(ThemeContext);
    const { audioVolume, setAudioVolume } = useContext(PlayerContext);

    // load the configurations as the app loads
    useEffect(() => {
        const lat = (localStorage.getItem('config-letAcrylicTints') === 'true');
        const cc = localStorage.getItem('config-colorConfig');
        const av = parseFloat(localStorage.getItem('config-audioVolume')) || 1.0;

        if (cc === 'light')
            document.body.classList.add('light-mode');
        else
            document.body.classList.remove('light-mode');

        setLetAcrylicTints(lat);
        setColorConfig(cc);
        setAudioVolume(av);
    }, []);

    // save audioVolume
    useEffect(() => {
        localStorage.setItem('config-audioVolume', String(audioVolume));
    }, [audioVolume]);

    // save letAcrylicTints
    useEffect(() => {
        localStorage.setItem('config-letAcrylicTints', letAcrylicTints);
    }, [letAcrylicTints]);

    // save colorConfig
    useEffect(() => {
        localStorage.setItem('config-colorConfig', colorConfig);
    }, [colorConfig]);

    // not returning any element means this component does not make an element 
    // in the DOM.
    // It is used as a component so that it has access to the contexts and 
    // their setters.
    return <></>;
};

export default ConfigurationLoader;