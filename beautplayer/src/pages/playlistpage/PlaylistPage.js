import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as base64 from 'byte-base64';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './PlaylistPage.module.scss';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'

const PlaylistPage = props => {
    // tracks has the format: [title, artist, duration, trackId]
    const [tracks, setTracks] = useState({
        isPlaylist: true,
        tracks: [],
    });
    const [albumPageAlbumYear, setAlbumPageAlbumYear] = useState('');
    const [albumPageAlbumGenre, setAlbumPageAlbumGenre] = useState('');
    const [albumPageAlbumArtist, setAlbumPageAlbumArtist] = useState('');
    const [albumPageAlbumArt, setAlbumPageAlbumArt] = useState('');
    let history = useHistory();

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
    });

    useEffect(() => {
        
        // fetch the album data
        // get the tracks of the album
        axios.get(API + '/playlists/' + playlistName)
            .then(async resp => {
                const playlist = resp.data.Playlist;
                const playlistTracks = playlist.tracks;

                // setAlbumPageAlbumYear(playlist.year.join(", "));
                // setAlbumPageAlbumArtist(playlist.albumArtist.join(", "));
                // setAlbumPageAlbumGenre(playlist.genre.join(", "));

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
            // .then(() => {
            //     // get playlist cover art
            //     const firstTrackId = tracksArray.tracks[0][3];
            //     axios.get(API + '/coverart/' + firstTrackId)
            //         .then(resp => {
            //             const picture = resp.data.coverArt.data;
            //             const pictureFormat = resp.data.format;
            //             let base64Data = base64.bytesToBase64(picture);
            //             let src = `data:${pictureFormat};base64,${base64Data}`;
            //             setAlbumPageAlbumArt(src);
            //             tracksArray.albumArt = src;
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         })
            //         .then(() => tracksArray.album = playlistName)
            //         .then(() => setTracks(tracksArray));
            // })
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
                        src={albumPageAlbumArt || AlbumArt}
                    />
                    <table>
                        <tbody>
                            <tr>
                                <td>Playlist</td>
                                <td>{playlistName.replace('%2F', '/')}</td>
                            </tr>
                            <tr>
                                <td>Artists</td>
                                <td>{albumPageAlbumArtist}</td>
                            </tr>
                            <tr>
                                <td>Years</td>
                                <td>{albumPageAlbumYear}</td>
                            </tr>
                            <tr>
                                <td>Genres</td>
                                <td>{albumPageAlbumGenre}</td>
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