import { React, useState, useEffect, useContext } from 'react';
import './../commonstyles.scss';

import axios from 'axios';
import * as base64 from 'byte-base64';

import PlayerContext from '../playercontext';
import ThemeContext from '../themecontext';

import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';

const ColorThief = require('color-thief');

const PlayButton = props => {
    const { playPause, setPlayPause, setCurrentTrack, setAlbumTitle, setAlbumArtist, setLinkBack,
        setAlbumArt, audioSrc, setAudioSrc, setAudioDuration } = useContext(PlayerContext);

    const { setAcrylicColor, letAcrylicTints, artContext } = useContext(ThemeContext);

    const [playButtonState, setPlayButtonState] = useState('play-button');

    // to get the acrylic color tint
    const getDominantColorAlbumArt = async () => {
        let colorThief = new ColorThief();
        let rgb = colorThief.getColor(artContext.current);
        setAcrylicColor(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`);
    };

    // play/pause toggle
    const play = () => {
        if (audioSrc === props.audioSrc) {
            if (playPause === 'play')
                setPlayPause('pause');
            else
                setPlayPause('play');
        } else {
            setAudioSrc(props.audioSrc);
            // let duration = 0;
            let duration = props.audioDuration.split(":");
            setAudioDuration(parseFloat(duration[0]) * 60 + parseFloat(duration[1]));

            setAlbumArt(props.albumArt);

            setAlbumArtist(props.albumArtist);
            setCurrentTrack(props.track);
            setAlbumTitle(props.albumTitle);

            getDominantColorAlbumArt();

            if (props.isPlaylist)
                setLinkBack(`/playlist/${props.playlistTitle}`);
            else
                setLinkBack(`/album/${props.albumTitle}`);

            props.addToQueue(
                {
                    'trackId': props.audioSrc,
                    'audioSrc': props.audioSrc,
                    'audioDuration': props.audioDuration,
                    'track': props.track,
                    'albumArt': props.albumArt,
                    'albumTitle': props.albumTitle,
                    'albumArtist': props.albumArtist,
                    'isPlaylist': props.isPlaylist,
                    'playlistTitle': props.playlistTitle,
                    'linkBack': (props.isPlaylist
                        ? `/playlist/${props.playlistTitle}`
                        : `/album/${props.albumTitle}`)
                }
            );

            setPlayPause('play');
        }
    };

    // reset if audio source is changed
    useEffect(() => {
        if (audioSrc !== props.audioSrc)
            setPlayButtonState('play-button');
        else
            setPlayButtonState('pause-button');
    }, [audioSrc]);

    // sync with player bar play/pause button
    useEffect(() => {
        if (playPause === 'play' && audioSrc === props.audioSrc)
            setPlayButtonState('pause-button');
        else
            setPlayButtonState('play-button');
    }, [playPause]);

    return (
        <img
            data-dark-mode-compatible
            onClick={play}
            src={
                playButtonState === 'play-button'
                    ? PlayIcon
                    : PauseIcon
            }
            alt="Play Button"
        />
    );
};

export default PlayButton;