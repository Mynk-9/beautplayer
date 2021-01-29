import { React, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './AlbumPage.module.scss';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'

const AlbumPage = props => {
    const [tracks, setTracks] = useState([]);
    const [albumArtist, setAlbumArtist] = useState('');
    const [albumYear, setAlbumYear] = useState(0);
    const [albumGenre, setAlbumGenre] = useState('');

    // api endpoint
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    // get the tracks of the album
    const albumName = 'A Thousand Suns';
    useEffect(() => {
        let tracksTemp = [];
        axios.get(API + '/albums/' + albumName)
            .then(async resp => {
                const albumTracks = resp.data.Album.tracks;
                for (const track of albumTracks) {
                    await axios.get(API + '/tracks/' + track._id)
                        .then(resp => {
                            const trackInfo = resp.data.Track;

                            const trackTitle = trackInfo.title;
                            const trackAlbumArtist = trackInfo.albumArtist;
                            const trackMins = Math.floor(trackInfo.length / 60);
                            const trackSecs = Math.round(trackInfo.length % 60);

                            tracksTemp.push(
                                [
                                    trackTitle,
                                    trackAlbumArtist,
                                    trackMins + ':' + (trackSecs < 10 ? '0' : '') + trackSecs
                                ]
                            );
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
                setTracks(tracksTemp);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // load the header album info from the first track of album
    useEffect(() => {
        axios.get(API + '/albums/' + albumName)
            .then(async resp => {
                const firstTrack = resp.data.Album.tracks[0];
                await axios.get(API + '/tracks/' + firstTrack._id)
                    .then(resp => {
                        const trackInfo = resp.data.Track;
                        let genres = '';
                        setAlbumYear(trackInfo.year);
                        setAlbumArtist(trackInfo.albumArtist);
                        for (const genre of trackInfo.genre)
                            genres += genre + ' ';
                        setAlbumGenre(genres);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Navbar />
            <div className={Styles.section}>
                <div className={Styles.header}>
                    <img data-dark-mode-compatible
                        alt="Go Back"
                        className={Styles.back}
                        src={LeftIcon}
                    />
                    <img alt="Album Art" className={Styles.albumArt} src={AlbumArt} />
                    <table>
                        <tbody>
                            <tr>
                                <td>Album</td>
                                <td>{albumName}</td>
                            </tr>
                            <tr>
                                <td>Artist</td>
                                <td>{albumArtist}</td>
                            </tr>
                            <tr>
                                <td>Year</td>
                                <td>{albumYear}</td>
                            </tr>
                            <tr>
                                <td>Genre</td>
                                <td>{albumGenre}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={Styles.content}>
                    <TrackList tracks={tracks} />
                </div>
            </div>
            <PlayerBar />
        </>
    );
    // }
}

export default AlbumPage;