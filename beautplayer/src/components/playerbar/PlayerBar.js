import { React, useState } from 'react';
import './../commonstyles.scss';
import Styles from './PlayerBar.module.scss';

import BackIcon from './../../assets/buttonsvg/skip-back.svg';
import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';
import NextIcon from './../../assets/buttonsvg/skip-forward.svg';
import PlusIcon from './../../assets/buttonsvg/plus.svg';
import MinusIcon from './../../assets/buttonsvg/minus.svg';
import VolumeHighIcon from './../../assets/buttonsvg/volume-1.svg';
import VolumeLowIcon from './../../assets/buttonsvg/volume-2.svg';

const PlayerBar = props => {
    const [volumeStatus, setVolumeStatus] = useState(false);
    const [play, setPlay] = useState(false);

    let acrylicColorStyle;
    if (props.acrylicColor)
        acrylicColorStyle = { '--acrylic-color': props.acrylicColor };
    else
        acrylicColorStyle = {};

    return (
        <footer
            className={`${Styles.playerBar} acrylic`}
            style={acrylicColorStyle}
        >
            <div className={Styles.left}>
                <div className={Styles.albumArt} style={{ backgroundImage: `url(${props.albumArt})` }} />
                <div className={Styles.albumInfo}>
                    <span>
                        <b>{props.AlbumTitle}</b>
                        <br />
                        <i>{props.albumArtist}</i>
                    </span>
                </div>
            </div>
            <div className={Styles.center}>
                <button><img alt="Back" src={BackIcon} /></button>
                <button
                    onClick={() => {
                        setPlay(!play);
                    }}
                >
                    <img
                        alt="Play"
                        src={
                            play
                                ? PlayIcon
                                : PauseIcon
                        }
                    />
                </button>
                <button><img alt="Next" src={NextIcon} /></button>
            </div>
            <div className={Styles.right}>
                <button><img alt="VolDown" src={MinusIcon} /></button>
                <img
                    alt="Volume Status"
                    src={
                        volumeStatus
                            ? VolumeHighIcon
                            : VolumeLowIcon
                    }
                    className={Styles.volumeStatus}
                />
                <button><img alt="VolUp" src={PlusIcon} /></button>
            </div>
        </footer>
    );
};

export default PlayerBar;