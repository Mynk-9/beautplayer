import { React, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import TrackLiker from './../../components/trackliker/TrackLiker';
import TrackOptions from './../../components/trackoptions/TrackOptions';
import PlayButton from './../../components/playbutton/PlayButton';
import AddToPlaylistModal from '../../components/addtoplaylistmodal/AddToPlaylistModal';

import './../../components/commonstyles.scss';
import Styles from './SearchPage.module.scss';

import ThemeContext from './../../components/themecontext';
import SearchContext from './../../components/searchcontext';

import QueueManager from './../../components/queuemanager';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg';
import PlusIcon from './../../assets/buttonsvg/plus.svg';
import PlusCircleIcon from './../../assets/buttonsvg/plus-circle.svg';
import CheckIcon from './../../assets/buttonsvg/check.svg';
import { albumArt } from '../../components/coverArtAPI';

const SearchPage = () => {
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const [tableAcrylicColorStyle, setTableAcrylicColorStyle] = useState({});
    const [trackList, setTrackList] = useState([]);
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const [searchList, setSearchList] = useState([]);

    const [addToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);
    const [addToPlaylistModalTrackId, setAddToPlaylistModalTrackId] = useState(null);
    const [addToPlaylistModalTrackName, setAddToPlaylistModalTrackName] = useState(null);

    useEffect(() => {
        if (!letAcrylicTints) {
            setAcrylicColorStyle({});
            setTableAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
        }
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '') {
                setAcrylicColorStyle({ '--acrylic-color': acrylicColor });
                setTableAcrylicColorStyle({ '--acrylic-color': String(acrylicColor.slice(0, acrylicColor.length - 6) + ', 0.3)') });
            }
            else {
                setAcrylicColorStyle({});
                setTableAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
            }
        }
    }, [acrylicColor, letAcrylicTints]);

    let history = useHistory();

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    // picked from TrackList.js
    const getTrackData = (data) => {
        return {
            'trackId': data[3],
            'audioSrc': data[3],
            'audioDuration': data[2],
            'track': data[0],
            'albumArt': (
                albumArt(data[4])
            ),
            'albumTitle': (
                data[4]
            ),
            'albumArtist': data[1],
            'isPlaylist': false,
            'playlistTitle': '',
            'linkBack': (
                `/album/${data[4]}`
            ),
        };
    };

    // create new search if new searchTerm is provided
    useEffect(() => {
        axios.get(`${API}/search/${searchTerm}`)
            .then(resp => {
                let trackList = resp.data.TrackList;
                let newSearchList = trackList.map(trackInfo => {

                    // code taken from album page
                    const trackTitle = trackInfo.title;
                    const trackAlbumArtist = trackInfo.albumArtist;
                    const trackMins = Math.floor(trackInfo.length / 60);
                    const trackSecs = Math.round(trackInfo.length % 60);
                    const trackId = trackInfo._id;
                    const albumTitle = trackInfo.album;

                    return getTrackData([
                        trackTitle,
                        trackAlbumArtist,
                        trackMins + ':' + (trackSecs < 10 ? '0' : '') + trackSecs,
                        trackId,
                        albumTitle
                    ]);
                });

                setSearchList(newSearchList);
            })
            .catch(err => {
                console.log(err);
            })
    }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    // build track list from search list
    useEffect(() => {
        let key = 0;
        let _trackList = searchList.map((data) => {
            ++key;
            return (
                <tr key={key} className={Styles.trackEntry}>
                    <td>
                        <TrackOptions
                            options={[
                                {
                                    'component': <TrackLiker trackId={data.trackId} />,
                                    'text': 'Like',
                                },
                                {
                                    'text': 'Add to Queue',
                                    'component': (
                                        <img
                                            alt={""}
                                            src={PlusCircleIcon}
                                            data-dark-mode-compatible
                                        />
                                    ),
                                    'successComponent': (
                                        <img
                                            alt={"Done"}
                                            src={CheckIcon}
                                            data-dark-mode-compatible
                                        />
                                    ),
                                    'onClick': () =>
                                        QueueManager.addTrack(data),
                                },
                                {
                                    'component':
                                        <img
                                            alt={""}
                                            src={PlusIcon}
                                            onClick={() => {
                                                setAddToPlaylistModalTrackId(data.trackId);
                                                setAddToPlaylistModalTrackName(data.track);
                                                setAddToPlaylistModalVisible(true);
                                            }}
                                            data-dark-mode-compatible
                                        />,
                                    'text': 'Add to Playlist',
                                },
                            ]}
                        />
                    </td>
                    <td>
                        <PlayButton
                            audioSrc={data.audioSrc}
                            trackId={data.trackId}
                            audioDuration={data.audioDuration}
                            track={data.track}
                            albumArt={data.albumArt}
                            albumTitle={data.albumTitle}
                            albumArtist={data.albumArtist}
                            isPlaylist={data.isPlaylist}
                            playlistTitle={data.playlistTitle}
                            linkBack={data.linkBack}
                            addToQueue={() =>
                                QueueManager.addTrack(data)
                            }
                        />
                    </td>
                    <td>{data.track}</td>
                    <td>{data.albumArtist}</td>
                    <td>{data.audioDuration}</td>
                </tr>
            );
        });

        setTrackList(_trackList);
    }, [searchList]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {
                addToPlaylistModalVisible
                    ? <AddToPlaylistModal
                        trackId={addToPlaylistModalTrackId}
                        trackName={addToPlaylistModalTrackName}
                        close={() => setAddToPlaylistModalVisible(false)}
                        acrylicColorStyle={acrylicColorStyle}
                    />
                    : <></>
            }
            <div className={Styles.section} style={acrylicColorStyle} data-animate-gradient={letAcrylicTints}>
                <div className={Styles.header}>
                    <img data-dark-mode-compatible
                        alt="Go Back"
                        className={Styles.back}
                        src={LeftIcon}
                        onClick={() => {
                            setSearchTerm('');
                            history.goBack();
                        }}
                    />
                    <h1 className={Styles.heading}>{`Search: ${searchTerm}`}</h1>
                </div>
                <div className={Styles.content}>
                    <table
                        className={Styles.trackList}
                        style={tableAcrylicColorStyle}
                    >
                        <tbody>
                            {trackList}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default SearchPage;