import React from 'react';
import './../commonstyles.scss';
// import Styles from './TrackLike.module.scss';

import HeartIconFilled from './../../assets/buttonsvg/heart-filled.svg';
import HeartIconEmpty from './../../assets/buttonsvg/heart.svg';

class TrackLike extends React.Component {
    constructor() {
        super();
        this.state = { liked: this.fetchLikeStatus() };
    }

    fetchLikeStatus = () => {
        // TODO: Fetch liked status from media server
        return false;
    };
    updateLikeStatus = async () => {
        // TODO: Update liked status on media server
        return true;
    };
    toggleLikeStatus = () => {
        this.setState({ liked: !this.state.liked });
        this.updateLikeStatus();
    }

    render() {
        return (
            <img
                data-dark-mode-compatible
                src={
                    this.state.liked
                        ? HeartIconFilled
                        : HeartIconEmpty
                }
                onClick={this.toggleLikeStatus}
                alt={
                    this.state.liked
                        ? "Liked"
                        : "Not Liked"
                }
            />
        );
    }
}

export default TrackLike;