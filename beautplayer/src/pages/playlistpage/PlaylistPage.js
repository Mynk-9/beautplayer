import { React, useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import TrackList from './../../components/tracklist/TrackList';
import Modal from '../../components/modal/Modal';
import { albumArt, playlistArt } from './../../components/coverArtAPI';

import API from './../../components/apiLink';
import PlayerManager from '../../components/playermanager';
import QueueManager from './../../components/queuemanager';
import PersistentStorage from '../persistentstorage';

import './../../components/commonstyles.scss';
import Styles from './PlaylistPage.module.scss';

import ThemeContext from './../../components/themecontext';
import PlayerContext from './../../components/playercontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg';
import PlayIcon from './../../assets/buttonsvg/play.svg';
import TrashIcon from './../../assets/buttonsvg/trash-2.svg';
import PlusCircleIcon from './../../assets/buttonsvg/plus-circle.svg';
import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg';

const ColorThief = require('color-thief');

const PlaylistPage = props => {
    // tracks has the format: [title, artist, duration, trackId]
    const [tracks, setTracks] = useState({
        isPlaylist: true,
        playlistName: '',
        tracks: [],
    });
    const [playlistPageName, setPlaylistPageName] = useState('');
    const [playlistPageYear, setPlaylistPageYear] = useState('');
    const [playlistPageGenre, setPlaylistPageGenre] = useState('');
    const [playlistPageArt, setPlaylistPageArt] = useState('');
    let history = useHistory();

    // context of album art image, acrylic color
    const { setArtContext, setAcrylicColor } = useContext(ThemeContext);
    const imgRef = useRef(null);

    // player context
    const {
        setPlayPause,
        setCurrentTrack,
        setAlbumTitle,
        setAlbumArtist,
        setLinkBack,
        setAlbumArt,
        setAudioSrc,
        setAudioDuration,
    } = useContext(PlayerContext);

    const playerManager = PlayerManager.getInstance();

    // modal state hooks
    const [showModal, setShowModal] = useState({
        open: false,
        heading: null,
        body: null,
        buttons: null,
    });

    let tracksArray = {
        isPlaylist: true,
        playlistTitle: '',
        tracks: [],
    };

    useEffect(() => {
        setPlaylistPageName(props.match.params.playlistName);
        setArtContext(imgRef);
        imgRef.current.crossOrigin = 'Anonymous'; // fix for: "canvas has been tainted by cross-origin data" security error
    }, [props.match.params.playlistName]); // eslint-disable-line react-hooks/exhaustive-deps

    // fetch the playlist data
    // get the tracks of the playlist
    const refreshPlaylist = () => {
        axios
            .get(API + '/playlists/' + playlistPageName)
            .then(async resp => {
                const playlist = resp.data.Playlist;
                const playlistTracks = playlist.tracks;

                const playlistYears = new Set();
                const playlistGenres = new Set();

                for (const track of playlistTracks) {
                    playlistYears.add(track.year);
                    for (const genre of track.genre) {
                        playlistGenres.add(genre);
                    }
                }

                setPlaylistPageYear(Array.from(playlistYears).join(', '));
                setPlaylistPageGenre(Array.from(playlistGenres).join(', '));

                for (const track of playlistTracks) {
                    const trackInfo = track;

                    const trackTitle = trackInfo.title;
                    const trackAlbum = trackInfo.album;
                    const trackAlbumArtist = trackInfo.albumArtist;
                    const trackMins = Math.floor(trackInfo.length / 60);
                    const trackSecs = Math.round(trackInfo.length % 60);
                    const trackId = trackInfo._id;

                    tracksArray.tracks.push([
                        trackTitle,
                        trackAlbumArtist,
                        trackMins +
                            ':' +
                            (trackSecs < 10 ? '0' : '') +
                            trackSecs,
                        trackId,
                        trackAlbum,
                    ]);
                }

                tracksArray.playlistTitle = playlistPageName;

                // first reset the value then set the value
                // done to rectify React not updating
                // Play button and other possibly overlooked
                // things on removing track above current
                // track
                setTracks({
                    isPlaylist: true,
                    playlistName: '',
                    tracks: [],
                });
                setTracks(tracksArray);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (!playlistPageName) return; // see AlbumPage.js:51 for explanation

        // set playlist cover art
        const src = playlistArt(playlistPageName.replace('%2F', '/'));
        setPlaylistPageArt(src);

        // fetch the playlist data
        // get the tracks of the playlist
        refreshPlaylist();
    }, [playlistPageName]); // eslint-disable-line react-hooks/exhaustive-deps

    const removeTrack = async trackId => {
        let success = false;
        await axios
            .delete(
                `${API}/playlists/${playlistPageName.replace(
                    '%2F',
                    '/'
                )}/${trackId}`
            )
            .then(resp => {
                if (resp.status === 200) success = true;
                else console.log(resp);
            })
            .catch(err => {
                console.log(err);
            });

        refreshPlaylist();

        return success;
    };

    // function to generate track data from track array
    // picked from TrackList.js
    const getTrackData = data => {
        return {
            trackId: data[3],
            audioSrc: data[3],
            audioDuration: data[2],
            track: data[0],
            albumArt: albumArt(String(data[4]).replace('%2F', '/')),
            albumTitle: data[4],
            albumArtist: data[1],
            isPlaylist: true,
            playlistTitle: tracks.playlistTitle,
            linkBack: `/playlist/${tracks.playlistTitle}`,
        };
    };

    // taken from PlayerButton and PlayerBar
    const setTheTrack = data => {
        //////// copied from play button {

        const getDominantColorAlbumArt = async thisAlbumArt => {
            let imgEle = document.createElement('img');

            imgEle.onerror = () => (imgEle.src = AlbumArt);
            imgEle.onload = () => {
                let colorThief = new ColorThief();
                let rgb = colorThief.getColor(imgEle, 1);
                setAcrylicColor(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`);
            };

            imgEle.crossOrigin = 'Anonymous';
            imgEle.src = thisAlbumArt;
        };

        setAudioSrc(data.audioSrc);

        let duration = data.audioDuration.split(':');
        setAudioDuration(
            parseFloat(duration[0]) * 60 + parseFloat(duration[1])
        );

        setAlbumArt(data.albumArt);

        setAlbumArtist(data.albumArtist);
        setCurrentTrack(data.track);
        setAlbumTitle(data.albumTitle);

        getDominantColorAlbumArt(data.albumArt);

        setLinkBack(data.linkBack);

        //////// } copied from play button
    };

    const deletePlaylist = async () => {
        let success = false;
        await axios
            .delete(`${API}/playlists/${playlistPageName.replace('%2F', '/')}`)
            .then(resp => {
                if (resp.status === 200) success = true;
                else console.log(resp);
            })
            .catch(err => {
                console.log(err);
            });

        // if successful, clear playlists cache and navigate back
        if (success) {
            localStorage.removeItem('all-playlists');
            PersistentStorage.MainPagePlaylistCards = [];
            history.goBack();
        } else return false;
    };

    const addPlaylistToQueue = () => {
        let trackDataList = tracks.tracks.map(data => getTrackData(data));
        QueueManager.addTracksMany(trackDataList);
    };

    const playPlaylist = () => {
        // clear the queue and add many
        let trackDataList = tracks.tracks.map(data => getTrackData(data));
        QueueManager.clearQueue();
        QueueManager.addTracksMany(trackDataList);
        // start the play
        let track0Data = getTrackData(tracks.tracks[0]);
        let track0DurationSplit = track0Data.audioDuration.split(':');
        let track0Duration =
            parseFloat(track0DurationSplit[0]) * 60 +
            parseFloat(track0DurationSplit[1]);
        setTheTrack(track0Data);
        setPlayPause('play');
        playerManager.setCurrentTrack(track0Data.trackId, track0Duration);
        playerManager.play();
        playerManager.forcePrefetch();
    };

    return (
        <>
            {showModal.open ? (
                <Modal
                    heading={showModal.heading}
                    body={showModal.body}
                    buttons={showModal.buttons}
                    close={() =>
                        setShowModal({
                            open: false,
                            heading: null,
                            body: null,
                            buttons: null,
                        })
                    }
                />
            ) : null}
            <div className={Styles.section}>
                <div
                    className={Styles.headerBackgroundWrapper}
                    style={{ backgroundImage: `url(${playlistPageArt})` }}
                >
                    <div className={Styles.header}>
                        <img
                            data-dark-mode-compatible
                            alt="Go Back"
                            className={Styles.back}
                            src={LeftIcon}
                            onClick={() => history.goBack()}
                        />
                        <img
                            alt="Album Art"
                            className={Styles.albumArt}
                            onError={img => {
                                img.target.src = AlbumArt;
                            }}
                            src={playlistPageArt || AlbumArt}
                            ref={imgRef}
                        />
                        <table>
                            <tbody>
                                <tr>
                                    <td>Playlist</td>
                                    <td>
                                        {playlistPageName.replace('%2F', '/')}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Years</td>
                                    <td>{playlistPageYear}</td>
                                </tr>
                                <tr>
                                    <td>Genres</td>
                                    <td>{playlistPageGenre}</td>
                                </tr>
                                <tr>
                                    <td>Actions</td>
                                    <td>
                                        <span
                                            className={
                                                Styles.actionButtonWrapper
                                            }
                                        >
                                            <button
                                                className={Styles.actionButton}
                                                data-action={'Play Playlist'}
                                                onClick={playPlaylist}
                                            >
                                                <img
                                                    src={PlayIcon}
                                                    alt={'Play Playlist'}
                                                    data-dark-mode-compatible
                                                />
                                            </button>
                                            <span>Play Playlist</span>
                                        </span>
                                        <span
                                            className={
                                                Styles.actionButtonWrapper
                                            }
                                        >
                                            <button
                                                className={Styles.actionButton}
                                                data-action={'Add to Queue'}
                                                onClick={addPlaylistToQueue}
                                            >
                                                <img
                                                    src={PlusCircleIcon}
                                                    alt={'Add to Queue'}
                                                    data-dark-mode-compatible
                                                />
                                            </button>
                                            <span>Add to Queue</span>
                                        </span>
                                        <span
                                            className={
                                                Styles.actionButtonWrapper
                                            }
                                        >
                                            <button
                                                className={Styles.actionButton}
                                                data-action={'Delete Playlist'}
                                                onClick={() => {
                                                    setShowModal({
                                                        open: true,
                                                        heading: 'Confirm',
                                                        body: 'Do you want to delete the playlist?',
                                                        buttons: [
                                                            {
                                                                text: 'Yes',
                                                                function:
                                                                    deletePlaylist,
                                                            },
                                                            {
                                                                text: 'No',
                                                                function:
                                                                    () => {},
                                                            },
                                                        ],
                                                    });
                                                }}
                                            >
                                                <img
                                                    src={TrashIcon}
                                                    alt={'Delete Playlist'}
                                                    data-dark-mode-compatible
                                                />
                                            </button>
                                            <span>Delete Playlist</span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={Styles.content}>
                    <TrackList
                        tracks={tracks}
                        isPlaylist={true}
                        showRemoveOption={true}
                        removeTrack={trackId => removeTrack(trackId)}
                        showAddToQueueOption={true}
                    />
                </div>
            </div>
        </>
    );
};

export default PlaylistPage;
