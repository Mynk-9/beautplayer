import { React, useState } from 'react';
import TrackLiker from './../../components/trackliker/TrackLiker';
import PlayButton from '../playbutton/PlayButton';
import './../commonstyles.scss';
import Styles from './TrackList.module.scss';

import { albumArt } from '../coverArtAPI';

const TrackList = props => {
    let nowPlaying = -1;

    let key = 0;
    let trackList = props.tracks.tracks.map((data) => {
        ++key;
        return (
            <tr key={key} className={Styles.trackEntry}>
                <td><TrackLiker trackId={data[3]} /></td>
                <td>
                    <PlayButton
                        audioSrc={data[3]}
                        audioDuration={data[2]}
                        track={data[0]}
                        albumArt={
                            props.tracks.isPlaylist
                                ? albumArt(data[4].replace('%2F', '/'))
                                : props.tracks.albumArt
                        }
                        albumTitle={
                            props.tracks.isPlaylist ? data[4] : props.tracks.album
                        }
                        albumArtist={data[1]}
                        isPlaylist={
                            props.tracks.isPlaylist
                                ? true
                                : false
                        }
                    />
                </td>
                <td>{data[0]}</td>
                <td>{data[1]}</td>
                <td>{data[2]}</td>
            </tr>
        );
    });

    return (
        <table className={Styles.trackList}>
            <tbody>
                {trackList}
            </tbody>
        </table>
    );
};

export default TrackList;