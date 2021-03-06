import { React, useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './PlaylistPage.module.scss';

import ThemeContext from './../../components/themecontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'
import { playlistArt } from './../../components/coverArtAPI';

const PlaylistPage = props => {
    // tracks has the format: [title, artist, duration, trackId]
    const [tracks, setTracks] = useState({
        isPlaylist: true,
        tracks: [],
    });
    const [playlistPageYear, setPlaylistPageYear] = useState('');
    const [playlistPageGenre, setPlaylistPageGenre] = useState('');
    const [playlistPageArtist, setPlaylistPageArtist] = useState('');
    const [playlistPageArt, setPlaylistPageArt] = useState('');
    let history = useHistory();

    // context of album art image
    const { setArtContext } = useContext(ThemeContext);
    const imgRef = useRef(null);

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';


    let playlistName = props.match.params.playlistName;
    let tracksArray = {
        isPlaylist: true,
        tracks: []
    };

    useEffect(() => {
        playlistName = props.match.params.playlistName;
        setArtContext(imgRef);
        imgRef.current.crossOrigin = 'Anonymous'; // fix for: "canvas has been tainted by cross-origin data" security error
    });

    useEffect(() => {

        // set playlist cover art
        const src = playlistArt(playlistName.replace('%2F', '/'));
        setPlaylistPageArt(src);

        // fetch the album data
        // get the tracks of the album
        axios.get(API + '/playlists/' + playlistName)
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

                setTracks(tracksArray);
            })
            .catch(err => {
                console.log(err);
            });
    }, [playlistName]);

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
                                <td>{playlistName.replace('%2F', '/')}</td>
                            </tr>
                            <tr>
                                <td>Years</td>
                                <td>{playlistPageYear}</td>
                            </tr>
                            <tr>
                                <td>Genres</td>
                                <td>{playlistPageGenre}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={Styles.content}>
                    <TrackList tracks={tracks} />
                </div>
            </div>
        </>
    );
}

export default PlaylistPage;