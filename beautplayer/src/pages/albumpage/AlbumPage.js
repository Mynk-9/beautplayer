import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import TrackList from './../../components/tracklist/TrackList';
import './../../components/commonstyles.scss';
import Styles from './AlbumPage.module.scss';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg'

export default class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        // generating test data
        let tracks = [];
        for (let i = 1; i <= 10; ++i) {
            tracks.push([
                'track' + i, 'artist' + i, 'duration' + i
            ]);
        }

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
                                    <td>Awesome Album</td>
                                </tr>
                                <tr>
                                    <td>Artist</td>
                                    <td>Human</td>
                                </tr>
                                <tr>
                                    <td>Year</td>
                                    <td>2021</td>
                                </tr>
                                <tr>
                                    <td>Genre</td>
                                    <td>Humanity</td>
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
    }
}