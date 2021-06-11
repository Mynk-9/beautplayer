import { React } from 'react';
import { useHistory } from 'react-router-dom';
import './../commonstyles.scss';
import Styles from './AlbumCard.module.scss';

const AlbumCard = props => {
    let history = useHistory();
    let openAlbum;
    if (props.isPlaylist)
        openAlbum = () => history.push('/playlist/' + props.albumTitle.replace('/', '%2F'));
    else
        openAlbum = () => history.push('/album/' + props.albumTitle.replace('/', '%2F'));
    
    const setDefaultAlbumArt = (img) => {
        img.target.src = props.albumArt;
    };

    return (
        <div className={Styles.albumCard}>
            <img
                alt="Album Art"
                onError={setDefaultAlbumArt}
                onClick={openAlbum}
                src={props.coverArtAPI || props.albumArt}
            />
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