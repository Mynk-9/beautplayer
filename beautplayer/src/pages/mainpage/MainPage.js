import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import AlbumCard from './../../components/albumcard/AlbumCard';
import './../../components/commonstyles.scss';
import Styles from './MainPage.module.scss';

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg';

export default class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {
            acrylicColor: '--acrylic-color',
        };
    }

    render() {
        return (
            <div>
                <Navbar
                    acrylicColor={this.state.acrylicColor}
                />
                <div className={Styles.mainBody}>
                    <div className={Styles.section}>
                        <div className={Styles.sectionHead}>
                            Playlist
                        </div>
                        <div className={Styles.sectionBody}>
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        </div>
                    </div>
                    <div className={Styles.section}>
                        <div className={Styles.sectionHead}>
                            Playlist
                        </div>
                        <div className={Styles.sectionBody}>
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        </div>
                    </div>
                    <div className={Styles.section}>
                        <div className={Styles.sectionHead}>
                            Playlist
                        </div>
                        <div className={Styles.sectionBody}>
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        </div>
                    </div>
                </div>
                <PlayerBar
                    acrylicColor={this.state.acrylicColor}
                    albumArt={AlbumArt}
                    AlbumTitle="Awesome Album"
                    albumArtist="Human"
                />
            </div>
        );
    }
}