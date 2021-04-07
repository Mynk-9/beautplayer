import { React, useContext, useState } from 'react';
import PlayButton from '../playbutton/PlayButton';
import TrackOptions from '../trackoptions/TrackOptions';
import TrackLiker from '../trackliker/TrackLiker';
import AddToPlaylistModal from './../addtoplaylistmodal/AddToPlaylistModal';

import './../commonstyles.scss';
import Styles from './TrackList.module.scss';

import PlayerContext from './../playercontext';

import { albumArt } from '../coverArtAPI';

import PlusIcon from './../../assets/buttonsvg/plus.svg';
import MinusIcon from './../../assets/buttonsvg/minus.svg';

// props: tracks, showRemoveOption, removeTrack(trackId)
const TrackList = props => {
    const { playerQueue, setPlayerQueue } = useContext(PlayerContext);

    const [addToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);
    const [addToPlaylistModalTrackId, setAddToPlaylistModalTrackId] = useState(null);
    const [addToPlaylistModalTrackName, setAddToPlaylistModalTrackName] = useState(null);

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
                <td>
                    {props.showRemoveOption
                        ? <TrackOptions
                            options={[
                                {
                                    'component': <TrackLiker trackId={data[3]} />,
                                    'text': 'Like',
                                },
                                {
                                    'component':
                                        <img
                                            src={PlusIcon}
                                            onClick={() => {
                                                setAddToPlaylistModalTrackId(data[3]);
                                                setAddToPlaylistModalTrackName(data[0]);
                                                setAddToPlaylistModalVisible(true);
                                            }}
                                            data-dark-mode-compatible
                                        />,
                                    'text': 'Add to Playlist',
                                },
                                {
                                    'component':
                                        <img
                                            src={MinusIcon}
                                            onClick={() => props.removeTrack(data[3])}
                                            data-dark-mode-compatible
                                        />,
                                    'text': 'Remove',
                                },
                            ]}
                        />
                        : <TrackOptions
                            options={[
                                {
                                    'component': <TrackLiker trackId={data[3]} />,
                                    'text': 'Like',
                                },
                                {
                                    'component':
                                        <img
                                            src={PlusIcon}
                                            onClick={() => {
                                                setAddToPlaylistModalTrackId(data[3]);
                                                setAddToPlaylistModalTrackName(data[0]);
                                                setAddToPlaylistModalVisible(true);
                                            }}
                                            data-dark-mode-compatible
                                        />,
                                    'text': 'Add to Playlist',
                                },
                            ]}
                        />
                    }
                </td>
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
        <>
            {
                addToPlaylistModalVisible
                    ? <AddToPlaylistModal
                        trackId={addToPlaylistModalTrackId}
                        trackName={addToPlaylistModalTrackName}
                        close={() => setAddToPlaylistModalVisible(false)}
                    // acrylicColorStyle={acrylicColorStyle}
                    />
                    : <></>
            }
            <table className={Styles.trackList}>
                <tbody>
                    {trackList}
                </tbody>
            </table>
        </>
    );
};

export default TrackList;