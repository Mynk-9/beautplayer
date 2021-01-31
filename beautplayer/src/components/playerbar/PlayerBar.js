import { React, useState, useEffect } from 'react';
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
import UpIcon from './../../assets/buttonsvg/chevron-up.svg';
import DownIcon from './../../assets/buttonsvg/chevron-down.svg';

const PlayerBar = props => {
    const [volumeStatus, setVolumeStatus] = useState(false);
    const [play, setPlay] = useState(false);
    const [mobileOpenAlbumDetails, setMobileOpenAlbumDetails] = useState(false);

    let acrylicColorStyle;
    if (props.acrylicColor)
        acrylicColorStyle = { '--acrylic-color': props.acrylicColor };
    else
        acrylicColorStyle = {};

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    let togglePlay = () => {
        let audioPlayer = document.querySelector('footer > audio');
        if (play) {
            audioPlayer.pause();
            setPlay(false);
        }
        else {
            audioPlayer.play();
            setPlay(true);
        }
    };

    useEffect(() => {

        let audioSource = API + '/tracks/' + props.audioSrc + '/stream';
        console.log(audioSource);
        let audioPlayer = document.querySelector('footer > audio');
        audioPlayer.src = audioSource;
        
        if (!play) audioPlayer.pause();
        else audioPlayer.play();

    }, [props.audioSrc]);

    return (
        <footer
            className={`${Styles.playerBar} acrylic`}
            style={acrylicColorStyle}
        >
            {/* Audio Player */}
            <audio />

            <div className={Styles.left}>
                <div
                    className={Styles.albumArt}
                    style={{ backgroundImage: `url(${props.albumArt})` }}
                    onClick={
                        () => setMobileOpenAlbumDetails(!mobileOpenAlbumDetails)
                    }
                >
                    <img
                        alt=""
                        src={
                            mobileOpenAlbumDetails
                                ? DownIcon
                                : UpIcon
                        }
                        data-visible={
                            props.albumArt
                                ? 'true'
                                : 'false'
                        }
                    />
                </div>
                <div
                    className={Styles.albumInfo}
                    data-visible={
                        mobileOpenAlbumDetails && props.albumArt
                            ? 'true'
                            : 'false'
                    }
                >
                    <span>
                        <b>{props.AlbumTitle}</b>
                        <br />
                        <i>{props.albumArtist}</i>
                    </span>
                </div>
            </div>
            <div className={Styles.center}>
                <button className={"cursor-pointer"}>
                    <img data-dark-mode-compatible alt="Back" src={BackIcon} />
                </button>
                <button
                    className={"cursor-pointer"}
                    onClick={togglePlay}
                >
                    <img data-dark-mode-compatible
                        alt="Play"
                        src={
                            play
                                ? PauseIcon
                                : PlayIcon
                        }
                    />
                </button>
                <button className={"cursor-pointer"}>
                    <img data-dark-mode-compatible alt="Next" src={NextIcon} />
                </button>
            </div>
            <div className={Styles.right}>
                <button className={"cursor-pointer"}>
                    <img data-dark-mode-compatible alt="VolDown" src={MinusIcon} />
                </button>
                <img data-dark-mode-compatible
                    alt="Volume Status"
                    src={
                        volumeStatus
                            ? VolumeHighIcon
                            : VolumeLowIcon
                    }
                    className={Styles.volumeStatus}
                />
                <button className={"cursor-pointer"}>
                    <img data-dark-mode-compatible alt="VolUp" src={PlusIcon} />
                </button>
            </div>
        </footer>
    );
};

export default PlayerBar;