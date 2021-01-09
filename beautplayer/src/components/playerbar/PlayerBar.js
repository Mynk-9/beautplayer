import { React, useState } from 'react';
import Styles from './PlayerBar.module.scss';
import './../commonstyles.scss';

import BackButton from './../../assets/buttonsvg/skip-back.svg';
import PlayButton from './../../assets/buttonsvg/play.svg';
import NextButton from './../../assets/buttonsvg/skip-forward.svg';
import PlusButton from './../../assets/buttonsvg/plus.svg';
import MinusButton from './../../assets/buttonsvg/minus.svg';
import VolumeHighButton from './../../assets/buttonsvg/volume-1.svg';
import VolumeLowButton from './../../assets/buttonsvg/volume-2.svg';

const PlayerBar = props => {
    const [volumeStatus, setVolumeStatus] = useState(false);

    return (
        <footer className={`${Styles.playerBar} acrylic`}>
            <div className={Styles.left}>
                Now Playing song info
            </div>
            <div className={Styles.center}>
                <button><img alt="Back" src={BackButton} /></button>
                <button><img alt="Play" src={PlayButton} /></button>
                <button><img alt="Next" src={NextButton} /></button>
            </div>
            <div className={Styles.right}>
                <button><img alt="VolUp" src={PlusButton} /></button>
                <img
                    alt="Volume Status"
                    src={
                        volumeStatus 
                            ? VolumeHighButton
                            : VolumeLowButton
                    }
                    className={Styles.volumeStatus}
                />
                <button><img alt="VolDown" src={MinusButton} /></button>
            </div>
        </footer>
    );
};

export default PlayerBar;