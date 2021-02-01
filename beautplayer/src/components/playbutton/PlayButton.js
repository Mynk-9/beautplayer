import { React, useState, useEffect, useContext } from 'react';
import './../commonstyles.scss';

import PlayerContext from '../playercontext';

import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';

const PlayButton = props => {
    const { playPause, setPlayPause, setAlbumArt, audioSrc, setAudioSrc } = useContext(PlayerContext);
    const [playButtonState, setPlayButtonState] = useState('play-button');

    let play = () => {
        if (audioSrc === props.audioSrc) {
            if (playPause === 'play') {
                setPlayButtonState('play-button');
                setPlayPause('pause');
            } else {
                setPlayButtonState('pause-button');
                setPlayPause('play');
            }
        } else {
            setAudioSrc(props.audioSrc);
            setAlbumArt(props.albumArt);
            setPlayButtonState('pause-button');
            setPlayPause('play');
        }
    };

    useEffect(() => {
        if (audioSrc !== props.audioSrc)
            setPlayButtonState('play-button');
    }, [audioSrc]);

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