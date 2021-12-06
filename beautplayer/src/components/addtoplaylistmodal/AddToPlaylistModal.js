import { React, useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './../../components/commonstyles.scss';
import Styles from './AddToPlaylistModal.module.scss';

import API from './../apiLink';
import PersistentStorage from './../../pages/persistentstorage';

import XIcon from './../../assets/buttonsvg/x.svg';
import PlusIcon from './../../assets/buttonsvg/plus.svg';

// props: trackId, trackName, close(), acrylicColorStyle
const PlaylistsModal = props => {
    const [playlists, setPlaylists] = useState([]);
    const [okButtonText, setOkButtonText] = useState('Ok');
    const textBoxRef = useRef(null);

    const fetchPlaylists = () => {
        let _playlists = playlists;
        setPlaylists([]);

        axios
            .get(API + '/playlists')
            .then(resp => {
                setPlaylists(
                    resp.data.Playlists.map((data, key) => {
                        const playlistName = data._id;
                        if (playlistName === 'liked') return null;

                        return (
                            <div key={key}>
                                <input
                                    type="radio"
                                    name="playlists"
                                    id={playlistName}
                                    value={playlistName}
                                />
                                <label
                                    className={Styles.listItem}
                                    htmlFor={playlistName}
                                >
                                    {playlistName}
                                </label>
                            </div>
                        );
                    })
                );
            })
            .catch(err => {
                console.log(err);
                setPlaylists(_playlists);
            });
    };
    const addToPlaylist = async () => {
        const selectedPlaylist = document.querySelector(
            'input[type="radio"][name="playlists"]:checked'
        )?.value;
        if (!selectedPlaylist)
            // if no playlist is selected
            return -1;

        let success = 0;

        await axios
            .post(API + '/playlists', {
                playlistName: selectedPlaylist,
                trackId: props.trackId,
            })
            .then(resp => {
                if (resp.status !== 201) console.log(resp);
                else success = 1;
            })
            .catch(err => {
                console.log(err);
            });

        return success;
    };
    const createPlaylist = () => {
        const newPlaylistName = textBoxRef.current.value;
        let _playlist = (
            <div key={playlists.length}>
                <input
                    type="radio"
                    name="playlists"
                    id={newPlaylistName}
                    value={newPlaylistName}
                />
                <label className={Styles.listItem} htmlFor={newPlaylistName}>
                    {newPlaylistName}
                </label>
            </div>
        );

        setPlaylists(_playlists => [..._playlists, _playlist]);

        // clear playlist cache
        localStorage.clear('all-playlists');
        PersistentStorage.MainPagePlaylistCards = [];
    };

    useEffect(() => {
        fetchPlaylists();
    }, [props.trackId]); // eslint-disable-line react-hooks/exhaustive-deps
    // temporarily disabled exhaustive-deps check of linter that this line
    // as it is better to disable it than to make a work-around.

    return (
        <div className={Styles.modal}>
            <div
                className={`${Styles.box} acrylic`}
                style={props.acrylicColorStyle}
            >
                <div className={Styles.head}>
                    <span className={Styles.heading}>Add to Playlist</span>
                    <span
                        className={Styles.close}
                        onClick={() => props.close()}
                    >
                        <img
                            alt={'Close'}
                            src={XIcon}
                            data-dark-mode-compatible
                        />
                    </span>
                </div>
                <div className={Styles.body}>
                    <p>
                        Add{' '}
                        <span className={Styles.trackName}>
                            {props.trackName}
                        </span>{' '}
                        to the selected playlist:
                    </p>
                    <div className={Styles.listBox}>{playlists}</div>
                    {/* <p>
                        Add new playlist:
                    </p> */}
                    <div className={Styles.newPlaylist}>
                        <input type="text" ref={textBoxRef} />
                        <img
                            alt={'Add'}
                            src={PlusIcon}
                            className={`cursor-pointer`}
                            onClick={() => {
                                createPlaylist();
                                textBoxRef.current.value = '';
                            }}
                            data-dark-mode-compatible
                        />
                    </div>
                </div>
                <div className={Styles.foot}>
                    <span
                        className={`cursor-pointer`}
                        onClick={async () => {
                            let resp = await addToPlaylist();
                            if (resp === 1) {
                                // success
                                setTimeout(() => props.close(), 500);
                                setOkButtonText('Done!');
                            } else if (resp === 0) {
                                // failure
                                setTimeout(() => {
                                    setOkButtonText('Ok');
                                }, 2000);
                                setOkButtonText('Error! Please try again.');
                            } else if (resp === -1) {
                                // playlist not selected
                                setTimeout(() => {
                                    setOkButtonText('Ok');
                                }, 2000);
                                setOkButtonText('Please select a playlist.');
                            }
                        }}
                    >
                        {okButtonText}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PlaylistsModal;
