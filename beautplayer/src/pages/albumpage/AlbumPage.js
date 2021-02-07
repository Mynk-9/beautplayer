import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as base64 from 'byte-base64';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './AlbumPage.module.scss';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'

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

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';


    const albumName = props.match.params.albumName;
    let tracksArray = {
        albumArt: '',
        tracks: []
    };

    useEffect(() => {

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
                    await axios.get(API + '/tracks/' + track._id)
                        .then(resp => {
                            const trackInfo = resp.data.Track;

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

                            // if (albumPageAlbumYear === -1) {
                            //     let genres = '';
                            //     setAlbumPageAlbumYear(trackInfo.year);
                            //     setAlbumPageAlbumArtist(trackInfo.albumArtist);
                            //     for (const genre of trackInfo.genre)
                            //         genres += genre + ' ';
                            //     setAlbumPageAlbumGenre(genres);
                            // }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
            .then(() => {
                // get album cover art
                const firstTrackId = tracksArray.tracks[0][3];
                axios.get(API + '/coverart/' + firstTrackId)
                    .then(resp => {
                        const picture = resp.data.coverArt.data;
                        const pictureFormat = resp.data.format;
                        let base64Data = base64.bytesToBase64(picture);
                        let src = `data:${pictureFormat};base64,${base64Data}`;
                        setAlbumPageAlbumArt(src);
                        tracksArray.albumArt = src;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .then(() => setTracks(tracksArray));
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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
                    <TrackList tracks={tracks} />
                </div>
            </div>
        </>
    );
}

export default AlbumPage;