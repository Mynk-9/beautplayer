import { React, useEffect, useState } from 'react';
import axios from 'axios';
import AlbumCard from './../../components/albumcard/AlbumCard';
import './../../components/commonstyles.scss';
import PersistentStorage from './../persistentstorage';
import Styles from './MainPage.module.scss';

import AlbumArt from './../../assets/images/pexels-steve-johnson-1234853.jpg';

import { albumArtCompressed, playlistArtCompressed } from '../../components/coverArtAPI';

const MainPage = (props) => {
    const [allAlbums, setAllAlbums] = useState(
        PersistentStorage.MainPageAllAlbumCards.length > 0
            ? PersistentStorage.MainPageAllAlbumCards
            : []
    ); // pick from persistent storage if available

    const [allPlaylists, setAllPlaylists] = useState(
        PersistentStorage.MainPagePlaylistCards.length > 0
            ? PersistentStorage.MainPagePlaylistCards
            : []
    );

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    // for all album cards
    useEffect(() => {
        // skip if persistent storage already present
        if (PersistentStorage.MainPageAllAlbumCards.length > 0)
            return;

        // fetch albums
        let localStorageData = localStorage.getItem('all-albums');
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
                        coverArtAPI={albumArtCompressed(info.name)}
                    />
                );
            }
            PersistentStorage.MainPageAllAlbumCards = albumCards;
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
                            const track0Id = album.tracks[0];
                            let albumArtist = album.albumArtist.join(", ");

                            albumCards.push(
                                <AlbumCard
                                    key={name}
                                    albumArt={AlbumArt}
                                    albumTitle={name}
                                    albumArtist={albumArtist}
                                    coverArtAPI={albumArtCompressed(name)}
                                />
                            );
                            localStorageData.push({
                                name: name,
                                albumArtist: albumArtist,
                                track0Id: track0Id
                            });
                        }
                        localStorage.setItem('all-albums', JSON.stringify(localStorageData));
                        PersistentStorage.MainPageAllAlbumCards = albumCards;
                        setAllAlbums(albumCards);
                    } else {
                        console.log('Error:', resp);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
    }, []);

    // for playlists
    useEffect(() => {
        // skip if persistent storage already present
        if (PersistentStorage.MainPagePlaylistCards.length > 0)
            return;

        // fetch playlists
        let localStorageData = localStorage.getItem('all-playlists');
        if (localStorageData) {
            localStorageData = JSON.parse(localStorageData);
            let playlistCards = [];
            for (const info of localStorageData) {
                playlistCards.push(
                    <AlbumCard
                        key={info}
                        albumArt={AlbumArt}
                        albumTitle={info}
                        isPlaylist={true}
                        coverArtAPI={playlistArtCompressed(info)}
                    />
                );
            }
            PersistentStorage.MainPagePlaylistCards = playlistCards;
            setAllPlaylists(playlistCards);
        }
        else
            axios.get(API + '/playlists')
                .then(async resp => {
                    if (resp.status === 200) {
                        const playlists = resp.data.Playlists;
                        let playlistCards = [];
                        let localStorageData = [];

                        for (const playlist of playlists) {
                            playlistCards.push(
                                <AlbumCard
                                    key={playlist._id}
                                    albumArt={AlbumArt}
                                    albumTitle={playlist._id}
                                    isPlaylist={true}
                                    coverArtAPI={playlistArtCompressed(playlist._id)}
                                />
                            );
                            localStorageData.push(playlist._id);
                        }

                        localStorage.setItem('all-playlists', JSON.stringify(localStorageData));
                        PersistentStorage.MainPagePlaylistCards = playlistCards;
                        setAllPlaylists(playlistCards);
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
            <div className={Styles.mainBody}>
                <div className={Styles.section}>
                    <div className={Styles.sectionHead}>Playlists</div>
                    <div className={Styles.sectionBody}>
                        {allPlaylists}
                    </div>
                </div>
                <div className={Styles.section}>
                    <div className={Styles.sectionHead}>All Albums</div>
                    <div className={`${Styles.sectionBody} ${Styles.sectionBodyNoScroll}`}>
                        {allAlbums}
                    </div>
                </div>
            </div>
            {/* <PlayerBar
                acrylicColor={acrylicColor}
                albumArt={AlbumArt}
                AlbumTitle="Awesome Album"
                albumArtist="Human"
            /> */}
        </div>
    );
}


export default MainPage;