import { createContext } from 'react';

const ThemeContext = createContext({
    colorConfig: 'dark',
    setColorConfig: () => { },

    acrylicColor: '',
    setAcrylicColor: () => { },
    letAcrylicTints: false,
    setLetAcrylicTints: () => { },
    artContext: null,
    setArtContext: () => { }
});

export default ThemeContext;