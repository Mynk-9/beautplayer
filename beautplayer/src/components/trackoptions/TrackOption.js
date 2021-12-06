import { React, useState } from 'react';

import './../../components/commonstyles.scss';
import Styles from './TrackOptions.module.scss';

const TrackOption = props => {
    const [currentComponent, setCurrentComponent] = useState(props.component);

    return (
        <div
            className={Styles.optionsMenuItem}
            onClick={() => {
                if (!props.onClick) return;

                props.onClick();

                // if success component exist then utilise
                if (!props.successComponent) return;
                setCurrentComponent(props.successComponent);
                setTimeout(() => {
                    setCurrentComponent(props.component);
                }, 1000);
            }}
        >
            <span>{currentComponent}</span>
            <span>{props.text}</span>
        </div>
    );
};

export default TrackOption;
