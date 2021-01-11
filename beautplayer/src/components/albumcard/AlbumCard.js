import { React, useState } from 'react';
import './../commonstyles.scss';
import Styles from './AlbumCard.module.scss';

const AlbumCard = props => {
    return (
        <div className={Styles.albumCard}>
            <img alt="Album Art" src={props.albumArt} />
            <span>
                <b>{props.albumTitle}</b>
            </span>
            <span>
                <i>{props.albumArtist}</i>
            </span>
        </div>
    );
};

export default AlbumCard;