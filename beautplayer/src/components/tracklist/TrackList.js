import { React, useState } from 'react';
import TrackLiker from './../../components/trackliker/TrackLiker';
import './../commonstyles.scss';
import Styles from './TrackList.module.scss';

import PlayIcon from './../../assets/buttonsvg/play.svg';

const TrackList = props => {
    let nowPlaying = -1;

    let key = 0;
    let trackList = props.tracks.map((data) => {
        ++key;
        return (
            <tr key={key} className={Styles.trackEntry}>
                <td><TrackLiker trackId={data[3]} /></td>
                <td>
                    <img
                        data-dark-mode-compatible
                        onClick={() => { props.playStream(data[3]); console.log('play clicked'); }}
                        src={PlayIcon}
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

export default TrackList