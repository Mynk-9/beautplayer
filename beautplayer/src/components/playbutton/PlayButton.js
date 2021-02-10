import { React, useState, useEffect, useContext } from 'react';
import './../commonstyles.scss';

import axios from 'axios';
import * as base64 from 'byte-base64';

import PlayerContext from '../playercontext';

import PlayIcon from './../../assets/buttonsvg/play.svg';
import PauseIcon from './../../assets/buttonsvg/pause.svg';

const PlayButton = props => {
    const { playPause, setPlayPause, setCurrentTrack, setAlbumTitle, setAlbumArtist,
        setAlbumArt, audioSrc, setAudioSrc, setAudioDuration } = useContext(PlayerContext);

    const [playButtonState, setPlayButtonState] = useState('play-button');

    const fetchSetAlbumArt = async () => {
        // api endpoint -- same domain, port 5000
        let API = window.location.origin;
        API = API.substring(0, API.lastIndexOf(':'));
        API += ':5000';

        const trackId = props.audioSrc;

        axios.get(API + '/coverart/' + trackId)
            .then(resp => {
                if (resp.status === 200) {
                    const picture = resp.data.coverArt.data;
                    const pictureFormat = resp.data.format;
                    let base64Data = base64.bytesToBase64(picture);
                    let albumArtSrc = `data:${pictureFormat};base64,${base64Data}`;
                    setAlbumArt(albumArtSrc);
                } else
                    console.log('Error at fetching cover art for playerbar:',
                        resp.status);
            })
            .catch(err => {
                console.log(err);
            });
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

            if (props.isPlaylist)
                fetchSetAlbumArt();
            else
                setAlbumArt(props.albumArt);

            setAlbumArtist(props.albumArtist);
            setCurrentTrack(props.track);
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