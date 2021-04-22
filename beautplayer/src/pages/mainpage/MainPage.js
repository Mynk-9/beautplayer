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

    // albums sort function
    const albumsSortFunctions = {
        'name': (a, b) => {
            return a.props.albumTitle.localeCompare(b.props.albumTitle);
        },
        'name-reverse': (a, b) => {
            // negate the output to reverse the sort
            return parseInt(-a.props.albumTitle.localeCompare(b.props.albumTitle));
        },
        'release-year': (a, b) => {
            let releaseYearArrayA = a.props.year;
            let releaseYearArrayB = b.props.year;
            releaseYearArrayA.sort((a, b) => b - a);
            releaseYearArrayB.sort((a, b) => b - a);
            let lowerUpperLimit =
                releaseYearArrayA.length < releaseYearArrayB.length
                    ? releaseYearArrayA.length
                    : releaseYearArrayB.length;

            for (let i = 0; i < lowerUpperLimit; ++i) {
                let cmp = releaseYearArrayA[i] - releaseYearArrayB[i];
                if (cmp !== 0)
                    return cmp;
            }

            // if everything else fails, sort by name in ascending order.
            return a.props.albumTitle.localeCompare(b.props.albumTitle);
        },
        'release-year-reverse': (a, b) => {
            let releaseYearArrayA = a.props.year;
            let releaseYearArrayB = b.props.year;
            releaseYearArrayA.sort((a, b) => b - a);
            releaseYearArrayB.sort((a, b) => b - a);
            let lowerUpperLimit =
                releaseYearArrayA.length < releaseYearArrayB.length
                    ? releaseYearArrayA.length
                    : releaseYearArrayB.length;

            for (let i = 0; i < lowerUpperLimit; ++i) {
                let cmp = releaseYearArrayB[i] - releaseYearArrayA[i];
                if (cmp !== 0)
                    return cmp;
            }

            // if everything else fails, sort by name in ascending order.
            return a.props.albumTitle.localeCompare(b.props.albumTitle);
        },
        'default': (a, b) => {   // same as 'name'
            return a.props.albumTitle.localeCompare(b.props.albumTitle);
        },
    };

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
                        year={info.year}
                    />
                );
            }
            albumCards.sort(albumsSortFunctions.default);
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
                            const year = album.year;
                            let albumArtist = album.albumArtist.join(", ");

                            albumCards.push(
                                <AlbumCard
                                    key={name}
                                    albumArt={AlbumArt}
                                    albumTitle={name}
                                    albumArtist={albumArtist}
                                    coverArtAPI={albumArtCompressed(name)}
                                    year={year}
                                />
                            );
                            localStorageData.push({
                                name: name,
                                albumArtist: albumArtist,
                                year: year,
                            });
                        }
                        localStorage.setItem('all-albums', JSON.stringify(localStorageData));
                        albumCards.sort(albumsSortFunctions.default);
                        PersistentStorage.MainPageAllAlbumCards = albumCards;
                        setAllAlbums(albumCards);
                    } else {
                        console.log('Error:', resp);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const selectSection = (sectionHead) => {
        let sectionHeadParent = sectionHead.parentNode;
        let sectionList = sectionHead.parentNode.parentNode.childNodes;
        let sectionHeads = sectionHeadParent.querySelectorAll('span');
        let sectionOptions = sectionHeadParent.querySelectorAll('div');
        const sectionFor = sectionHead.getAttribute('data-for');

        // set section head
        for (const thisSectionHead of sectionHeads)
            thisSectionHead.setAttribute('data-selected', false);
        sectionHead.setAttribute('data-selected', true);

        // set section
        for (const thisSection of sectionList) {
            if (thisSection.getAttribute('data-for') === sectionFor)
                thisSection.setAttribute('data-selected', true);
            else
                thisSection.setAttribute('data-selected', false);
        }

        // set options
        for (const sectionOption of sectionOptions) {
            sectionOption.setAttribute(
                'data-visible',
                sectionOption.getAttribute('data-for') === sectionFor
            );
        }

        // set persistent storage
        PersistentStorage.MainPageActivePage = sectionFor;
    };

    const sortChange = (sortBy) => {
        let _allAlbums = [...allAlbums];
        _allAlbums.sort(albumsSortFunctions[sortBy]);
        setAllAlbums(_allAlbums);
        PersistentStorage.MainPageAllAlbumCards = _allAlbums;
        PersistentStorage.MainPageAlbumsSort = sortBy;
    };

    return (
        <div>
            <div className={Styles.mainBody}>
                <div className={Styles.sectionHeadList}>
                    <span
                        className={Styles.sectionHead}
                        onClick={(e) => selectSection(e.target)}
                        data-for={"albums"}
                        data-selected={
                            PersistentStorage.MainPageActivePage === "albums"
                        }
                    >
                        Albums
                    </span>
                    <span
                        className={Styles.sectionHead}
                        onClick={(e) => selectSection(e.target)}
                        data-for={"playlist"}
                        data-selected={
                            PersistentStorage.MainPageActivePage === "playlist"
                        }
                    >
                        Playlists
                    </span>

                    <div
                        className={Styles.sectionOption}
                        data-for={"albums"}
                        data-visible={
                            PersistentStorage.MainPageActivePage === 'albums'
                        }
                    >
                        <span>
                            <label>Sort by:</label>
                            <select
                                name={"main-page-album-sort"}
                                id={"main-page-album-sort"}
                                onChange={(e) => sortChange(e.target.value)}
                                value={PersistentStorage.MainPageAlbumsSort}
                            >
                                <option value="name">
                                    Name
                                </option>
                                <option value="name-reverse">
                                    Name (reverse)
                                </option>
                                <option value="release-year">
                                    Release Year
                                </option>
                                <option value="release-year-reverse">
                                    Release Year (reverse)
                                </option>
                            </select>
                        </span>
                    </div>
                </div>
                <div
                    className={Styles.section}
                    data-for={"albums"}
                    data-selected={
                        PersistentStorage.MainPageActivePage === "albums"
                    }
                >
                    <div className={`${Styles.sectionBody} ${Styles.sectionBodyNoScroll}`}>
                        {allAlbums}
                    </div>
                </div>
                <div
                    className={Styles.section}
                    data-for={"playlist"}
                    data-selected={
                        PersistentStorage.MainPageActivePage === "playlist"
                    }
                >
                    <div className={`${Styles.sectionBody} ${Styles.sectionBodyNoScroll}`}>
                        {allPlaylists}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MainPage;