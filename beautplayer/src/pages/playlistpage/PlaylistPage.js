import { React, useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './PlaylistPage.module.scss';

import ThemeContext from './../../components/themecontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'
import PlayIcon from './../../assets/buttonsvg/play.svg';
import TrashIcon from './../../assets/buttonsvg/trash-2.svg';
import PlusCircleIcon from './../../assets/buttonsvg/plus-circle.svg';

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'
import { playlistArt } from './../../components/coverArtAPI';

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

    // context of album art image
    const { setArtContext } = useContext(ThemeContext);
    const imgRef = useRef(null);

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';


    let tracksArray = {
        isPlaylist: true,
        playlistTitle: '',
        tracks: []
    };

    useEffect(() => {
        setPlaylistPageName(props.match.params.playlistName);
        setArtContext(imgRef);
        imgRef.current.crossOrigin = 'Anonymous'; // fix for: "canvas has been tainted by cross-origin data" security error
    }, [props.match.params.playlistName]); // eslint-disable-line react-hooks/exhaustive-deps

    // fetch the playlist data
    // get the tracks of the playlist
    const refreshPlaylist = () => {
        axios.get(API + '/playlists/' + playlistPageName)
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

                setPlaylistPageYear(Array.from(playlistYears).join(", "));
                setPlaylistPageGenre(Array.from(playlistGenres).join(", "));

                for (const track of playlistTracks) {
                    const trackInfo = track;

                    const trackTitle = trackInfo.title;
                    const trackAlbum = trackInfo.album;
                    const trackAlbumArtist = trackInfo.albumArtist;
                    const trackMins = Math.floor(trackInfo.length / 60);
                    const trackSecs = Math.round(trackInfo.length % 60);
                    const trackId = trackInfo._id;

                    tracksArray.tracks.push(
                        [
                            trackTitle,
                            trackAlbumArtist,
                            trackMins + ':' + (trackSecs < 10 ? '0' : '') + trackSecs,
                            trackId,
                            trackAlbum,
                        ]
                    );
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

        // set playlist cover art
        const src = playlistArt(playlistPageName.replace('%2F', '/'));
        setPlaylistPageArt(src);

        // fetch the playlist data
        // get the tracks of the playlist
        refreshPlaylist();

    }, [playlistPageName]); // eslint-disable-line react-hooks/exhaustive-deps

    const removeTrack = async (trackId) => {
        let success = false;
        await axios.delete(`${API}/playlists/${playlistPageName.replace('%2F', '/')}/${trackId}`)
            .then(resp => {
                if (resp.status === 200)
                    success = true;
                else
                    console.log(resp);
            })
            .catch(err => {
                console.log(err);
            });

        refreshPlaylist();

        return success;
    };

    // TODO: implement the following
    /*
    const deletePlaylist = () => {

    };

    const addPlaylistToQueue = () => {

    };

    const playPlaylist = () => {

    };
    */

    return (
        <>
            <div className={Styles.section}>
                <div className={Styles.header}>
                    <img data-dark-mode-compatible
                        alt="Go Back"
                        className={Styles.back}
                        src={LeftIcon}
                        onClick={() => history.goBack()}
                    />
                    <img
                        alt="Album Art"
                        className={Styles.albumArt}
                        onError={(img) => {
                            img.target.src = AlbumArt;
                        }}
                        src={playlistPageArt || AlbumArt}
                        ref={imgRef}
                    />
                    <table>
                        <tbody>
                            <tr>
                                <td>Playlist</td>
                                <td>{playlistPageName.replace('%2F', '/')}</td>
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
                                    <button
                                        onClick={() => {
                                            console.log('play playlist');
                                        }}
                                    >
                                        <img
                                            src={PlayIcon}
                                            alt={""}
                                            data-dark-mode-compatible
                                        />
                                        <span>Play Playlist</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('add to queue');
                                        }}
                                    >
                                        <img
                                            src={PlusCircleIcon}
                                            alt={""}
                                            data-dark-mode-compatible
                                        />
                                        <span>Add to Queue</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('delete playlist');
                                        }}
                                    >
                                        <img
                                            src={TrashIcon}
                                            alt={""}
                                            data-dark-mode-compatible
                                        />
                                        <span>Delete Playlist</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={Styles.content}>
                    <TrackList
                        tracks={tracks}
                        showRemoveOption={true}
                        removeTrack={(trackId) => removeTrack(trackId)}
                        showAddToQueueOption={true}
                    />
                </div>
            </div>
        </>
    );
}

export default PlaylistPage;