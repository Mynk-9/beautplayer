import { React, useState, useEffect, useContext } from 'react';
import './../commonstyles.scss';

import PlayerContext from '../playercontext';

import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';

const PlayButton = props => {
    const { playPause, setPlayPause, setAlbumTitle, setAlbumArtist,
        setAlbumArt, audioSrc, setAudioSrc } = useContext(PlayerContext);

    const [playButtonState, setPlayButtonState] = useState('play-button');

    // play/pause toggle
    let play = () => {
        if (audioSrc === props.audioSrc) {
            if (playPause === 'play')
                setPlayPause('pause');
            else
                setPlayPause('play');
        } else {
            setAudioSrc(props.audioSrc);

            setAlbumArt(props.albumArt);
            setAlbumArtist(props.albumArtist);
            setAlbumTitle(props.albumTitle);

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