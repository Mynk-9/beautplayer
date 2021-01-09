import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import AlbumCard from './../../components/albumcard/AlbumCard';
import './../../components/commonstyles.scss';
import Styles from './MainPage.module.scss';

import AlbumArt from './../../assets/images/pexels-sebastian-palomino-1955134.jpg';

export default class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {
            darkMode: '',
            acrylicColor: 'rgba(0,200,200,0.6)'
        };
    }

    setDarkMode = e => {
        if (e)
            this.setState({ darkMode: 'dark-mode' });
        else
            this.setState({ darkMode: '' });
    };

    render() {
        return (
            <div id="color-mode-setter" className={this.state.darkMode}>
                <Navbar acrylicColor={this.state.acrylicColor} />
                <div className={Styles.mainBody}>
                    <div className={Styles.section}>
                        <div className={Styles.sectionHead}>
                            Section Head
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
                            Section Head
                        </div>
                        <div className={Styles.sectionBody}>
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        </div>
                    </div>
                    <div className={Styles.section}>
                        <div className={Styles.sectionHead}>
                            Section Head
                        </div>
                        <div className={Styles.sectionBody}>
                            <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        </div>
                    </div>
                </div>
                <PlayerBar acrylicColor={this.state.acrylicColor} nowPlayingAlbumArt={AlbumArt} />
            </div>
        );
    }
}