import { React, useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom'
import ProgressBar from './../progressbar/ProgressBar';
import './../commonstyles.scss';
import Styles from './PlayerBar.module.scss';

import PlayerContext from './../playercontext';
import ThemeContext from './../themecontext';

import BackIcon from './../../assets/buttonsvg/skip-back.svg';
import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';
import NextIcon from './../../assets/buttonsvg/skip-forward.svg';
import PlusIcon from './../../assets/buttonsvg/plus.svg';
import MinusIcon from './../../assets/buttonsvg/minus.svg';
import VolumeHighIcon from './../../assets/buttonsvg/volume-2.svg';
import VolumeNormalIcon from './../../assets/buttonsvg/volume-1.svg';
import VolumeNoneIcon from './../../assets/buttonsvg/volume-0.svg';
import UpIcon from './../../assets/buttonsvg/chevron-up.svg';
import DownIcon from './../../assets/buttonsvg/chevron-down.svg';

const PlayerBar = props => {
    const { playPause, albumArt, currentTrack, albumTitle, albumArtist, audioSrc, audioDuration, setPlayPause } = useContext(PlayerContext);
    let audioPlayerRef = useRef(null);
    let history = useHistory();

    // volume states: high, normal, none, muted
    const [volumeStatus, setVolumeStatus] = useState('high');
    const [volumeDisplay, setVolumeDisplay] = useState(100);
    const [mobileOpenAlbumDetails, setMobileOpenAlbumDetails] = useState(false);

    // acrylic color management
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);
    useEffect(() => {
        if (!letAcrylicTints)
            setAcrylicColorStyle({});
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '')
                setAcrylicColorStyle({ '--acrylic-color': acrylicColor })
            else
                setAcrylicColorStyle({});
        }
    }, [acrylicColor, letAcrylicTints]);

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    let togglePlay = () => {
        if (playPause === 'play') {
            setPlayPause('pause');
        }
        else {
            setPlayPause('play');
        }
    };

    useEffect(() => {

        let audioSource = API + '/tracks/' + audioSrc + '/stream';
        audioPlayerRef.current.src = audioSource;

        if (playPause === 'pause') audioPlayerRef.current.pause();
        else audioPlayerRef.current.play();

    }, [audioSrc]);

    useEffect(() => {
        if (playPause === 'play')
            audioPlayerRef.current.play();
        else
            audioPlayerRef.current.pause();
    }, [playPause]);

    let reduceVolume = () => {
        if (audioPlayerRef.current.volume > 0)
            audioPlayerRef.current.volume =
                parseFloat(audioPlayerRef.current.volume - 0.1).toFixed(2);

        if (audioPlayerRef.current.volume === 1.0)
            setVolumeStatus('high');
        else if (audioPlayerRef.current.volume === 0.0)
            setVolumeStatus('none');
        else
            setVolumeStatus('normal');

        setVolumeDisplay(audioPlayerRef.current.volume * 100);
    };
    let increaseVolume = () => {
        if (audioPlayerRef.current.volume < 1)
            audioPlayerRef.current.volume =
                parseFloat(audioPlayerRef.current.volume + 0.1).toFixed(2);

        if (audioPlayerRef.current.volume === 1.0)
            setVolumeStatus('high');
        else if (audioPlayerRef.current.volume === 0.0)
            setVolumeStatus('none');
        else
            setVolumeStatus('normal');

        setVolumeDisplay(audioPlayerRef.current.volume * 100);
    };


    return (
        <footer
            className={`${Styles.playerBar} acrylic`}
            style={acrylicColorStyle}
        >
            {/* Audio Player */}
            <audio
                onEnded={() => setPlayPause('pause')}
                ref={audioPlayerRef}
            />

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
                        <b
                            className={Styles.albumLinker}
                            onClick={() => {
                                history.push(`/album/${albumTitle}`);
                            }}
                        >
                            {currentTrack}
                        </b>
                        <br />
                        <i>{albumArtist}</i>
                    </span>
                </div>
            </div>
            <div className={Styles.center}>
                <div>
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
                <ProgressBar playerRef={audioPlayerRef} />
            </div>
            <div className={Styles.right}>
                <button className={"cursor-pointer"} onClick={reduceVolume}>
                    <img data-dark-mode-compatible alt="VolDown" src={MinusIcon} />
                </button>
                <span
                    className={Styles.volumeStatusWrapper}
                    data-value={volumeDisplay}
                >
                    <img data-dark-mode-compatible
                        alt="Volume Status"
                        src={
                            volumeStatus === 'high'
                                ? VolumeHighIcon
                                : volumeStatus === 'normal'
                                    ? VolumeNormalIcon
                                    : volumeStatus === 'none'
                                        ? VolumeNoneIcon
                                        : VolumeNormalIcon
                        }
                        className={Styles.volumeStatus}
                    />
                </span>
                <button className={"cursor-pointer"} onClick={increaseVolume}>
                    <img data-dark-mode-compatible alt="VolUp" src={PlusIcon} />
                </button>
            </div>
        </footer>
    );
};

export default PlayerBar;