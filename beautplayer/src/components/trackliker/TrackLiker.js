import { React, useState, useEffect } from 'react';
import axios from 'axios';
import './../commonstyles.scss';
// import Styles from './TrackLike.module.scss';

import HeartIconFilled from './../../assets/buttonsvg/heart-filled.svg';
import HeartIconEmpty from './../../assets/buttonsvg/heart.svg';

const TrackLiker = (props) => {
    const [liked, setLiked] = useState(false);

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    useEffect(() => {
        // fetch like status
        axios.get(API + '/playlists/liked/' + props.trackId)
            .then(resp => {
                if (resp.status === 200 && resp.data.found === true)
                    setLiked(true);
                else
                    setLiked(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, [props.trackId]); // eslint-disable-line react-hooks/exhaustive-deps

    let updateLikeStatus = async (newState) => {
        if (newState)
            axios.post(API + '/playlists/', {
                trackId: props.trackId,
                playlistName: 'liked'
            })
                .then(resp => {
                    if (resp.status === 201)
                        setLiked(true);
                })
                .catch(err => {
                    console.log(err);
                });
        else
            axios.delete(`${API}/playlists/liked/${props.trackId}`)
                .then(resp => {
                    if (resp.status === 200)
                        setLiked(false);
                })
                .catch(err => {
                    console.log(err);
                });
    };
    let toggleLikeStatus = () => {
        updateLikeStatus(!liked);
        setLiked(!liked);
    }

    return (
        <img
            data-dark-mode-compatible
            src={
                liked
                    ? HeartIconFilled
                    : HeartIconEmpty
            }
            onClick={toggleLikeStatus}
            alt={
                liked
                    ? "Liked"
                    : "Not Liked"
            }
        />
    );

}

export default TrackLiker;