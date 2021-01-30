import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as base64 from 'byte-base64';
import './../commonstyles.scss';
import Styles from './AlbumCard.module.scss';

const AlbumCard = props => {
    const [imgSource, setImgSource] = useState();

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    useEffect(() => {
        async function fetchAlbumArt() {

            // check if props.firstTrackId is present
            if (props.firstTrackId)
                // get album cover art
                axios.get(API + '/coverart/compressed/' + props.firstTrackId)
                    .then(resp => {
                        const picture = resp.data.coverArt.data;
                        let base64Data = base64.bytesToBase64(picture);
                        let albumArtSrc = `data:${picture.format};base64,${base64Data}`;
                        setImgSource(albumArtSrc);
                    })
                    .catch(err => {
                        console.log(err);
                    });
        }
        fetchAlbumArt();
    }, []);

    let history = useHistory();
    let openAlbum = () => history.push('/album/' + props.albumTitle.replace('/', '%2F'));

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