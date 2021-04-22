import { React } from 'react';
import TrackOption from './TrackOption';

import './../../components/commonstyles.scss';
import Styles from './TrackOptions.module.scss';

import MoreHorizontalIcon from './../../assets/buttonsvg/more-horizontal.svg';

// prop: options: [{component: <component />, text: "text"}, ...]
const TrackOptions = props => {

    let options = [];
    props.options.forEach((option, index) => {
        options.push(
            <TrackOption
                text={option.text}
                component={option.component}
                successComponent={option.successComponent}
                onClick={option.onClick}
                key={index}
            />
        );
    });

    return (
        <div className={Styles.trackOptions}>
            <div className={Styles.optionButton}>
                <img
                    data-dark-mode-compatible
                    alt={"More options"}
                    src={MoreHorizontalIcon}
                />
            </div>
            <div className={`${Styles.optionsMenu} acrylic`}>
                {options}
            </div>
        </div>
    );
};

export default TrackOptions;