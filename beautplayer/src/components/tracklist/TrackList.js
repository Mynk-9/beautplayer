import { React, useContext, useState } from 'react';
import PlayButton from '../playbutton/PlayButton';
import TrackOptions from '../trackoptions/TrackOptions';
import TrackLiker from '../trackliker/TrackLiker';
import AddToPlaylistModal from './../addtoplaylistmodal/AddToPlaylistModal';

import QueueManager from './../queuemanager';

import './../commonstyles.scss';
import Styles from './TrackList.module.scss';

import PlayerContext from './../playercontext';

import { albumArt } from '../coverArtAPI';

import PlusIcon from './../../assets/buttonsvg/plus.svg';
import MinusIcon from './../../assets/buttonsvg/minus.svg';
import PlusCircleIcon from './../../assets/buttonsvg/plus-circle.svg';
import CheckIcon from './../../assets/buttonsvg/check.svg';

// props: tracks, showRemoveOption, removeTrack(trackId)
const TrackList = props => {
    const { playerQueue, setPlayerQueue } = useContext(PlayerContext);

    const [addToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);
    const [addToPlaylistModalTrackId, setAddToPlaylistModalTrackId] = useState(null);
    const [addToPlaylistModalTrackName, setAddToPlaylistModalTrackName] = useState(null);

    let key = 0;
    let trackList = props.tracks.tracks.map((data) => {
        ++key;

        const trackData = {
            'trackId': data[3],
            'audioSrc': data[3],
            'audioDuration': data[2],
            'track': data[0],
            'albumArt': (
                props.tracks.isPlaylist
                    ? albumArt(data[4].replace('%2F', '/'))
                    : props.tracks.albumArt
            ),
            'albumTitle': (
                props.tracks.isPlaylist ? data[4] : props.tracks.album
            ),
            'albumArtist': data[1],
            'isPlaylist': (
                props.tracks.isPlaylist     // this is done to make
                    ? true                  // sure undefined is 
                    : false                 // not passed further
            ),
            'playlistTitle': props.tracks.playlistTitle,
            'linkBack': (
                props.tracks.isPlaylist
                    ? `/playlist/${props.tracks.playlistTitle}`
                    : `/album/${props.tracks.isPlaylist ? data[4] : props.tracks.album}`
            ),
        };

        // generate track options
        let trackOptionsList = [];
        trackOptionsList.push({
            'text': 'Like',
            'component': <TrackLiker trackId={trackData.trackId} />,
        });
        if (props.showAddToQueueOption) { // optional component
            trackOptionsList.push({
                'text': 'Add to Queue',
                'component': (
                    <img
                        alt={""}
                        src={PlusCircleIcon}
                        data-dark-mode-compatible
                    />
                ),
                'successComponent': (
                    <img
                        alt={"Done"}
                        src={CheckIcon}
                        data-dark-mode-compatible
                    />
                ),
                'onClick': () =>
                    QueueManager.addTrack(playerQueue, trackData, setPlayerQueue),
            });
        }
        trackOptionsList.push({
            'text': 'Add to Playlist',
            'component': (
                <img
                    alt={""}
                    src={PlusIcon}
                    data-dark-mode-compatible
                />
            ),
            'successComponent': (
                <img
                    alt={"Done"}
                    src={CheckIcon}
                    data-dark-mode-compatible
                />
            ),
            'onClick': () => {
                setAddToPlaylistModalTrackId(trackData.trackId);
                setAddToPlaylistModalTrackName(trackData.track);
                setAddToPlaylistModalVisible(true);
            },
        });
        if (props.showRemoveOption) { // optional component
            trackOptionsList.push({
                'text': 'Remove',
                'component': (
                    <img
                        alt={""}
                        src={MinusIcon}
                        data-dark-mode-compatible
                    />
                ),
                'onClick': () => props.removeTrack(trackData.trackId),
            });
        }

        return (
            <tr key={key} className={Styles.trackEntry}>
                <td>
                    <TrackOptions options={trackOptionsList} />
                </td>
                <td>
                    <PlayButton
                        audioSrc={trackData.audioSrc}
                        audioDuration={trackData.audioDuration}
                        track={trackData.track}
                        albumArt={trackData.albumArt}
                        albumTitle={trackData.albumTitle}
                        albumArtist={trackData.albumArtist}
                        isPlaylist={trackData.isPlaylist}
                        playlistTitle={trackData.playlistTitle}
                        linkBack={trackData.linkBack}
                        addToQueue={() =>
                            QueueManager.addTrack(playerQueue, trackData, setPlayerQueue)
                        }
                    />
                </td>
                <td>{trackData.track}</td>
                <td>{trackData.albumArtist}</td>
                <td>{trackData.audioDuration}</td>
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