import { React } from 'react';

import Styles from './BeautPlayerTitle.module.scss';
import '../commonstyles.scss';

const BeautPlayerTitle = props => {
    return (
        <span className={Styles.title}>
            <span>B</span>
            <span>e</span>
            <span>a</span>
            <span>u</span>
            <span>t</span>
            <span>P</span>
            <span>l</span>
            <span>a</span>
            <span>y</span>
            <span>e</span>
            <span>r</span>
        </span>
    )
};

export default BeautPlayerTitle;