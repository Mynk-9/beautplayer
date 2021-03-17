import { React, useContext } from 'react';
import TrackLiker from './../../components/trackliker/TrackLiker';
import PlayButton from '../playbutton/PlayButton';
import './../commonstyles.scss';
import Styles from './TrackList.module.scss';

import PlayerContext from './../playercontext';

import { albumArt } from '../coverArtAPI';

const TrackList = props => {
    const { playerQueue, setPlayerQueue } = useContext(PlayerContext);

    const addToQueue = (trackData) => {
        let queue = playerQueue;

        // remove the track from previous position to be added to front
        for (let i = 0; i < queue.length; ++i) {
            let track = queue[i];
            if (track.trackId === trackData.trackId) {
                queue.splice(i, 1);
                break;
            }
        }

        queue.push(trackData);
        setPlayerQueue(queue);
    };

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
                            props.tracks.isPlaylist     // this is done to make
                                ? true                  // sure undefined is 
                                : false                 // not passed further
                        }
                        playlistTitle={props.tracks.playlistTitle}
                        addToQueue={addToQueue}
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