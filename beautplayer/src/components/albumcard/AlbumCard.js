import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as base64 from 'byte-base64';
import './../commonstyles.scss';
import Styles from './AlbumCard.module.scss';

const AlbumCard = props => {
    const [imgSource, setImgSource] = useState();

    useEffect(() => {
        async function fetchAlbumArt() {

            // check if props.coverArtAPI is present
            if (props.coverArtAPI)
                // get album cover art
                axios.get(props.coverArtAPI)
                    .then(resp => {
                        const picture = resp.data.coverArt.data;
                        const pictureFormat = resp.data.format;
                        let base64Data = base64.bytesToBase64(picture);
                        let albumArtSrc = `data:${pictureFormat};base64,${base64Data}`;
                        setImgSource(albumArtSrc);
                    })
                    .catch(err => {
                        console.log(err);
                    });
        }
        fetchAlbumArt();
    }, []);

    let history = useHistory();
    let openAlbum;
    if (props.isPlaylist)
        openAlbum = () => history.push('/playlist/' + props.albumTitle.replace('/', '%2F'));
    else
        openAlbum = () => history.push('/album/' + props.albumTitle.replace('/', '%2F'));

    return (
        <div className={Styles.albumCard}>
            <img alt="Album Art" src={imgSource || props.albumArt} onClick={openAlbum} />
            <span onClick={openAlbum}>
                <b>{props.albumTitle}</b>
            </span>
            <span>
                <i>{props.albumArtist}</i>
            </span>
        </div>
    );
};

export default AlbumCard;