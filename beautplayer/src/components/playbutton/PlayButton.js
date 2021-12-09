import { React, useState, useEffect, useContext } from 'react';
import './../commonstyles.scss';

import PlayerContext from './../../contexts/playercontext';
import ThemeContext from './../../contexts/themecontext';

import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg';
import PlayerManager from './../../utilities/player/playermanager';

const ColorThief = require('color-thief');

const PlayButton = props => {
    const {
        playPause,
        setPlayPause,
        setCurrentTrack,
        setAlbumTitle,
        setAlbumArtist,
        setLinkBack,
        setAlbumArt,
        audioSrc,
        setAudioSrc,
        setAudioDuration,
    } = useContext(PlayerContext);

    const { setAcrylicColor } = useContext(ThemeContext);

    const [playButtonState, setPlayButtonState] = useState('play-button');

    const playerManager = PlayerManager.getInstance();

    // INFO:
    // following code is also copied to PlayerBar.js under minor modifications
    // in function nextTrack, don't forget to reflect any major changes there too

    // to get the acrylic color tint
    const getDominantColorAlbumArt = async () => {
        let imgEle = document.createElement('img');
        // imgEle.loading = 'lazy';

        imgEle.onerror = () => (imgEle.src = AlbumArt);
        imgEle.onload = () => {
            let colorThief = new ColorThief();
            let rgb = colorThief.getColor(imgEle, 1);
            setAcrylicColor(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`);
        };

        imgEle.crossOrigin = 'Anonymous';
        imgEle.src = props.albumArt;
    };

    // play/pause toggle
    const play = () => {
        if (audioSrc === props.audioSrc) {
            if (playPause === 'play') {
                setPlayPause('pause');
            } else {
                setPlayPause('play');
            }
        } else {
            setAudioSrc(props.audioSrc);
            // let duration = 0;
            let duration = props.audioDuration.split(':');
            setAudioDuration(
                parseFloat(duration[0]) * 60 + parseFloat(duration[1])
            );

            setAlbumArt(props.albumArt);

            setAlbumArtist(props.albumArtist);
            setCurrentTrack(props.track);
            setAlbumTitle(props.albumTitle);

            getDominantColorAlbumArt();

            setLinkBack(props.linkBack);

            props.addToQueue(); // add the track to queue

            playerManager.setCurrentTrack(
                props.trackId,
                parseFloat(duration[0]) * 60 + parseFloat(duration[1])
            );
            playerManager.forcePrefetch();
            setPlayPause('play');
        }
    };

    // reset if audio source is changed
    useEffect(() => {
        if (audioSrc !== props.audioSrc) setPlayButtonState('play-button');
        else setPlayButtonState('pause-button');
    }, [audioSrc, props.audioSrc]);

    // sync with player bar play/pause button
    useEffect(() => {
        if (playPause === 'play' && audioSrc === props.audioSrc)
            setPlayButtonState('pause-button');
        else setPlayButtonState('play-button');
    }, [playPause]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <img
            data-dark-mode-compatible
            onClick={play}
            src={playButtonState === 'play-button' ? PlayIcon : PauseIcon}
            alt="Play Button"
            className={'cursor-pointer'}
        />
    );
};

export default PlayButton;
