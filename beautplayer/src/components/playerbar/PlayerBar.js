import { React, useState, useEffect, useContext } from 'react';
import './../commonstyles.scss';
import Styles from './PlayerBar.module.scss';

import PlayerContext from './../playercontext';

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
    const { playPause, albumArt, albumTitle, albumArtist, audioSrc, setPlayPause } = useContext(PlayerContext);

    const [volumeStatus, setVolumeStatus] = useState(false);
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
        // let audioPlayer = document.querySelector('footer > audio');
        if (playPause === 'play') {
            // audioPlayer.pause();
            setPlayPause('pause');
        }
        else {
            // audioPlayer.play();
            setPlayPause('play');
        }
    };

    useEffect(() => {

        let audioSource = API + '/tracks/' + audioSrc + '/stream';
        let audioPlayer = document.querySelector('footer > audio');
        audioPlayer.src = audioSource;

        if (playPause === 'pause') audioPlayer.pause();
        else audioPlayer.play();

    }, [audioSrc]);

    useEffect(() => {
        let audioPlayer = document.querySelector('footer > audio');
        if (playPause === 'play')
            audioPlayer.play();
        else
            audioPlayer.pause();
    }, [playPause]);

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
                    style={{ backgroundImage: `url(${albumArt})` }}
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
                            albumArt
                                ? 'true'
                                : 'false'
                        }
                    />
                </div>
                <div
                    className={Styles.albumInfo}
                    data-visible={
                        mobileOpenAlbumDetails && albumArt
                            ? 'true'
                            : 'false'
                    }
                >
                    <span>
                        <b>{albumTitle}</b>
                        <br />
                        <i>{albumArtist}</i>
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
                            playPause === 'play'
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