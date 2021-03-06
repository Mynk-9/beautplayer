import { React, useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import ProgressBar from './../progressbar/ProgressBar';
import './../commonstyles.scss';
import Styles from './PlayerBar.module.scss';

import PlayerManager from './../playermanager';
import QueueManager from './../queuemanager';

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
import RepeatIcon from './../../assets/buttonsvg/repeat.svg';
import ShuffleIcon from './../../assets/buttonsvg/shuffle.svg';

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'

const ColorThief = require('color-thief');

const PlayerBar = props => {
    const { playPause, albumArt, currentTrack, albumArtist,
        audioVolume, audioSrc, linkBack,
        setCurrentTrack, setAlbumTitle, setAlbumArtist, setLinkBack,
        setAlbumArt, setAudioSrc, setAudioDuration, setPlayPause,
        setAudioVolume } = useContext(PlayerContext);
    let history = useHistory();
    // location hook required to retain after navigation the updated document
    // title containing the track name
    let location = useLocation();

    // volume states: high, normal, none, muted
    const [volumeStatus, setVolumeStatus] = useState('high');
    const [volumeDisplay, setVolumeDisplay] = useState(100);
    const [mobileOpenAlbumDetails, setMobileOpenAlbumDetails] = useState(false);

    // repeat and shuffle
    const [loopTrack, setLoopTrack] = useState(false);
    const [shuffle, setShuffle] = useState(false);

    // acrylic color management
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const { acrylicColor, setAcrylicColor, letAcrylicTints } = useContext(ThemeContext);
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

    // player manager instance
    const playerManager = PlayerManager.getInstance();

    let togglePlay = () => {
        if (playPause === 'play')
            setPlayPause('pause');
        else
            setPlayPause('play');
    };

    // advance on the playlist
    // copied from PlayButton.js under
    // minor modifications, don't forget to sync
    // major changes in both the files
    let setTheTrack = (data) => {
        //////// copied from play button {

        const getDominantColorAlbumArt = async (thisAlbumArt) => {
            let imgEle = document.createElement('img');

            imgEle.onerror = () => imgEle.src = AlbumArt;
            imgEle.onload = () => {
                let colorThief = new ColorThief();
                let rgb = colorThief.getColor(imgEle, 1);
                setAcrylicColor(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`);
            };


            imgEle.crossOrigin = "Anonymous";
            imgEle.src = thisAlbumArt;
        };


        setAudioSrc(data.audioSrc);

        let duration = data.audioDuration.split(":");
        setAudioDuration(parseFloat(duration[0]) * 60 + parseFloat(duration[1]));

        setAlbumArt(data.albumArt);

        setAlbumArtist(data.albumArtist);
        setCurrentTrack(data.track);
        setAlbumTitle(data.albumTitle);

        getDominantColorAlbumArt(data.albumArt);

        setLinkBack(data.linkBack);

        //////// } copied from play button 
    };
    let nextTrack = (autoSwitch = false) => {
        let trackId = audioSrc;     // both are same
        let trackData = QueueManager.getNextTrack(trackId);
        if (!trackData) {
            setPlayPause('pause');
            return;
        }
        setTheTrack(trackData);

        // if nextTrack is triggered from button press then autoSwitch is an 
        // Event, in that case make sure autoSwitch is made false (Boolean)
        if (autoSwitch !== true || autoSwitch !== false)
            autoSwitch = false;
        playerManager.next(autoSwitch);
    };
    let prevTrack = () => {
        // go to prev track if current time < 5s
        // else set current time to 0s
        if (playerManager.getPlayer().currentTime < 5) {
            let trackId = audioSrc;     // both are same
            let trackData = QueueManager.getPrevTrack(trackId);
            if (!trackData) {
                setPlayPause('pause');
                return;
            }
            setTheTrack(trackData);

            playerManager.prev();
        } else {
            playerManager.getPlayer().currentTime = 0;
        }
    };
    playerManager.setOnTrackEnd(() => nextTrack(true));

    useEffect(() => {
        if (audioVolume >= 0.8)
            setVolumeStatus('high');
        else if (parseFloat(audioVolume) === 0.0)
            setVolumeStatus('none');
        else
            setVolumeStatus('normal');

        setVolumeDisplay(parseFloat(audioVolume).toFixed(2) * 100);
    }, [audioVolume]);

    useEffect(() => {
        playerManager.setLoop(loopTrack);
    }, [loopTrack]);

    useEffect(() => {
        playerManager.setShuffle(shuffle);
    }, [shuffle]);

    useEffect(() => {
        document.title = 'BeautPlayer'
        if (currentTrack)
            document.title += ' - ' + currentTrack;
    }, [currentTrack, location]);

    let reduceVolume = () => {
        setAudioVolume(prevVal => {
            let newVol = parseFloat(parseFloat(prevVal).toFixed(2));
            newVol -= 0.1;
            if (newVol < 0.0)
                newVol = 0.0;
            else if (newVol > 1.0)
                newVol = 1.0;
            playerManager.setVolume(newVol);
            return newVol;
        });
    };
    let increaseVolume = () => {
        setAudioVolume(prevVal => {
            let newVol = parseFloat(parseFloat(prevVal).toFixed(2));
            newVol += 0.1;
            if (newVol < 0.0)
                newVol = 0.0;
            else if (newVol > 1.0)
                newVol = 1.0;
            playerManager.setVolume(newVol);
            return newVol;
        });
    };

    return (
        <footer
            className={`${Styles.playerBar} acrylic`}
            style={acrylicColorStyle}
        >
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
                    <div
                        className={Styles.albumLinker}
                        onClick={() => {
                            history.push(linkBack);
                        }}
                    >
                        {currentTrack}
                    </div>
                    <div className={Styles.albumArtistInfo}>
                        {albumArtist}
                    </div>
                </div>
            </div>
            <div className={Styles.center}>
                <div className={Styles.controlsWrapper}>
                    <button
                        className={`${Styles.buttonSmall} cursor-pointer display-desktop-only`}
                        data-visible={mobileOpenAlbumDetails}
                        data-active={shuffle}
                        onClick={
                            () => setShuffle(!shuffle)
                        }
                    >
                        <img
                            data-dark-mode-compatible
                            alt="Shuffle"
                            src={ShuffleIcon}
                        />
                    </button>
                    <button className={"cursor-pointer"} onClick={prevTrack}>
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
                    <button className={"cursor-pointer"} onClick={nextTrack}>
                        <img
                            data-dark-mode-compatible
                            alt="Next"
                            src={NextIcon}
                        />
                    </button>
                    <button
                        className={`${Styles.buttonSmall} cursor-pointer display-desktop-only`}
                        data-visible={mobileOpenAlbumDetails}
                        data-active={loopTrack}
                        onClick={
                            () => setLoopTrack(!loopTrack)
                        }
                    >
                        <img data-dark-mode-compatible alt="Repeat" src={RepeatIcon} />
                    </button>
                </div>
                <div>
                    {/* cloned above shuffle button for mobile displays */}
                    <button
                        className={`${Styles.buttonSmall} cursor-pointer display-mobile-only`}
                        data-visible={mobileOpenAlbumDetails}
                        data-active={shuffle}
                        onClick={
                            () => setShuffle(!shuffle)
                        }
                    >
                        <img
                            data-dark-mode-compatible
                            alt="Shuffle"
                            src={ShuffleIcon}
                        />
                    </button>
                    <button
                        className={`${Styles.buttonSmall} cursor-pointer display-mobile-only`}
                        data-visible={mobileOpenAlbumDetails}
                        data-active={loopTrack}
                        onClick={
                            () => setLoopTrack(!loopTrack)
                        }
                    >
                        <img data-dark-mode-compatible alt="Repeat" src={RepeatIcon} />
                    </button>
                </div>
                <ProgressBar />
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