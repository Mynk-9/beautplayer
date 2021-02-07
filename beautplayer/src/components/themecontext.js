import { createContext } from 'react';

const ThemeContext = createContext({
    colorConfig: 'dark',
    setColorConfig: () => { }
});

export default ThemeContext;