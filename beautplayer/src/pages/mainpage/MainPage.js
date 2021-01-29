import { React, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import AlbumCard from './../../components/albumcard/AlbumCard';
import './../../components/commonstyles.scss';
import Styles from './MainPage.module.scss';

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg';

const MainPage = (props) => {
    const [acrylicColor, setAcrylicColor] = useState('--acrylic-color');
    const [allAlbums, setAllAlbums] = useState([]);

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    useEffect(() => {
        // fetch albums
        let localStorageData = localStorage.getItem('all-albums')
        if (localStorageData) {
            localStorageData = JSON.parse(localStorageData);
            let albumCards = [];
            for (const info of localStorageData) {
                albumCards.push(
                    <AlbumCard
                        key={info.name}
                        albumArt={AlbumArt}
                        albumTitle={info.name}
                        albumArtist={info.albumArtist}
                        firstTrackId={info.track0Id}
                    />
                );
            }
            setAllAlbums(albumCards);
        }
        else
            axios.get(API + '/albums')
                .then(async resp => {
                    if (resp.status === 200) {
                        const albumList = resp.data.AlbumsList;
                        let albumCards = [];
                        let localStorageData = [];
                        for (const album of albumList) {
                            // console.log(album);
                            const name = album._id;
                            const track0Id = album.tracks[0]._id;
                            let albumArtist;

                            // get album artist
                            await axios.get(API + '/tracks/' + track0Id)
                                .then(resp => {
                                    const trackInfo = resp.data.Track;
                                    albumArtist = trackInfo.albumArtist;
                                })
                                .catch(err => {
                                    console.log(err);
                                });

                            albumCards.push(
                                <AlbumCard
                                    key={name}
                                    albumArt={AlbumArt}
                                    albumTitle={name}
                                    albumArtist={albumArtist}
                                    firstTrackId={track0Id}
                                />
                            );
                            localStorageData.push({
                                name: name,
                                albumArtist: albumArtist,
                                track0Id: track0Id
                            });
                        }
                        localStorage.setItem('all-albums', JSON.stringify(localStorageData));
                        setAllAlbums(albumCards);
                    } else {
                        console.log('Error:', resp);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
    }, []);

    return (
        <div>
            <Navbar
                acrylicColor={acrylicColor}
            />
            <div className={Styles.mainBody}>
                <div className={Styles.section}>
                    <div className={Styles.sectionHead}>Playlists</div>
                    <div className={Styles.sectionBody}>
                        <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                        <AlbumCard albumArt={AlbumArt} albumTitle={"Awesome Album"} albumArtist={"Human"} />
                    </div>
                </div>
                <div className={Styles.section}>
                    <div className={Styles.sectionHead}>All Albums</div>
                    <div className={`${Styles.sectionBody} ${Styles.sectionBodyNoScroll}`}>
                        {allAlbums}
                    </div>
                </div>
            </div>
            <PlayerBar
                acrylicColor={acrylicColor}
                albumArt={AlbumArt}
                AlbumTitle="Awesome Album"
                albumArtist="Human"
            />
        </div>
    );
}


export default MainPage;