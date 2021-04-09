import { React, useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as base64 from 'byte-base64';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './AlbumPage.module.scss';

import ThemeContext from '../../components/themecontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'
import { albumArt } from '../../components/coverArtAPI';

const AlbumPage = props => {
    // tracks has the format: [title, artist, duration, trackId]
    const [tracks, setTracks] = useState({
        albumArt: '',
        tracks: [],
    });
    const [albumPageAlbumYear, setAlbumPageAlbumYear] = useState('');
    const [albumPageAlbumGenre, setAlbumPageAlbumGenre] = useState('');
    const [albumPageAlbumArtist, setAlbumPageAlbumArtist] = useState('');
    const [albumPageAlbumArt, setAlbumPageAlbumArt] = useState('');
    let history = useHistory();

    // context of album art image
    const { setArtContext } = useContext(ThemeContext);
    const imgRef = useRef(null);

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';


    let albumName = props.match.params.albumName;
    let tracksArray = {
        album: '',
        albumArt: '',
        tracks: []
    };

    useEffect(() => {
        albumName = props.match.params.albumName;
        setArtContext(imgRef);
        imgRef.current.crossOrigin = 'Anonymous'; // fix for: "canvas has been tainted by cross-origin data" security error
    });

    useEffect(() => {

        // set album cover art
        const src = albumArt(albumName.replace('%2F', '/'));
        setAlbumPageAlbumArt(src);
        tracksArray.albumArt = src;

        tracksArray.tracks = [];

        // fetch the album data
        // get the tracks of the album
        axios.get(API + '/albums/' + albumName)
            .then(async resp => {
                const album = resp.data.Album;
                const albumTracks = album.tracks;

                setAlbumPageAlbumYear(album.year.join(", "));
                setAlbumPageAlbumArtist(album.albumArtist.join(", "));
                setAlbumPageAlbumGenre(album.genre.join(", "));

                for (const track of albumTracks) {
                    const trackInfo = track;

                    const trackTitle = trackInfo.title;
                    const trackAlbumArtist = trackInfo.albumArtist;
                    const trackMins = Math.floor(trackInfo.length / 60);
                    const trackSecs = Math.round(trackInfo.length % 60);
                    const trackId = trackInfo._id;

                    tracksArray.tracks.push(
                        [
                            trackTitle,
                            trackAlbumArtist,
                            trackMins + ':' + (trackSecs < 10 ? '0' : '') + trackSecs,
                            trackId
                        ]
                    );
                }
            })
            .then(() => tracksArray.album = albumName)
            .then(() => setTracks(tracksArray))
            .catch(err => {
                console.log(err);
            });
    }, [albumName]);

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
                        src={albumPageAlbumArt || AlbumArt}
                        ref={imgRef}
                    />
                    <table>
                        <tbody>
                            <tr>
                                <td>Album</td>
                                <td>{albumName.replace('%2F', '/')}</td>
                            </tr>
                            <tr>
                                <td>Artist</td>
                                <td>{albumPageAlbumArtist}</td>
                            </tr>
                            <tr>
                                <td>Year</td>
                                <td>{albumPageAlbumYear}</td>
                            </tr>
                            <tr>
                                <td>Genre</td>
                                <td>{albumPageAlbumGenre}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={Styles.content}>
                    <TrackList tracks={tracks} showAddToQueueOption={true} />
                </div>
            </div>
        </>
    );
}

export default AlbumPage;