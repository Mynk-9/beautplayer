import { React, useState } from 'react';
import TrackLiker from './../../components/trackliker/TrackLiker';
import PlayButton from '../playbutton/PlayButton';
import './../commonstyles.scss';
import Styles from './TrackList.module.scss';

const TrackList = props => {
    let nowPlaying = -1;

    let key = 0;
    console.log(props.tracks);
    let trackList = props.tracks.tracks.map((data) => {
        ++key;
        return (
            <tr key={key} className={Styles.trackEntry}>
                <td><TrackLiker trackId={data[3]} /></td>
                <td><PlayButton audioSrc={data[3]} albumArt={props.tracks.albumArt} /></td>
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