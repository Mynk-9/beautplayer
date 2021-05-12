import QueueManager from './queuemanager';

var PlayerManager = (() => {
    var instance;
    function init() {

        // prev track, current track, next track
        let players = [
            {
                player: new Audio(),
                trackId: null,
            },
            {
                player: new Audio(),
                trackId: null,
            },
            {
                player: new Audio(),
                trackId: null,
            },
        ];
        let _current = 0;
        let _next = 1;
        let _prev = 2;
        let shuffle = false;
        let playState = false;
        const updateCurrentIndex = (moveAhead = true) => {
            if (moveAhead)
                _current = _current < 2 ? _current + 1 : 0;
            else
                _current = _current > 0 ? _current - 1 : 2;

            _next = _current < 2 ? _current + 1 : 0;
            _prev = _current > 0 ? _current - 1 : 2;
        };

        // temporary setup of API link /////////////////////////
        let API = window.location.origin;                     //
        API = API.substring(0, API.lastIndexOf(':'));         //
        API += ':5000';                                       //
        ////////////////////////////////////////////////////////

        const prefetchNextTrack = () => {
            let nextTrackId =
                QueueManager.getNextTrack(players[_current].trackId, shuffle)?.trackId;
            if (nextTrackId && players[_next].trackId !== nextTrackId) {
                players[_next].trackId = nextTrackId;
                players[_next].player.src = `${API}/tracks/${nextTrackId}/stream`;
                players[_next].player.pause();
            }
        };
        const prefetchPrevTrack = () => {
            let prevTrackId =
                QueueManager.getPrevTrack(players[_current].trackId)?.trackId;
            if (prevTrackId && players[_prev].trackId !== prevTrackId) {
                players[_prev].trackId = prevTrackId;
                players[_prev].player.src = `${API}/tracks/${prevTrackId}/stream`;
                players[_prev].player.pause();
            }
        };


        return {
            /**
             * Force prefetch next track if not yet prefetched
             */
            forcePrefetch: () => {
                if (!players[_next].player.src
                    || players[_next].player.src === '')
                    prefetchNextTrack();
            },
            /**
             * Go to next track
             * @returns true if next playing, false if next not set
             */
            next: () => {
                players[_current].player.pause();
                if (!players[_next].player.src
                    || players[_next].player.src === '')
                    return false;

                players[_current].player.currentTime = 0;
                if (playState)
                    players[_next].player.play();
                updateCurrentIndex(true);
                prefetchNextTrack();

                return true;
            },
            /**
             * Go to prev track
             */
            prev: () => {
                players[_current].player.pause();
                if (!players[_prev].player.src
                    || players[_prev].player.src === '')
                    return false;

                players[_current].player.currentTime = 0;
                if (playState)
                    players[_prev].player.play();
                updateCurrentIndex(false);
                prefetchPrevTrack();

                return true;
            },
            /**
             * Sets current track of player and begins prefetch of previous and
             * next tracks in the queue
             * @param {String} trackId 
             * @returns false if trackId is null or empty, false if track is
             *          absent in queue, true otherwise
             */
            setCurrentTrack: (trackId) => {
                if (!trackId || trackId === '')
                    return false;
                if (!QueueManager.checkQueue(trackId))
                    return false;

                let playState = !players[_current].player.paused;
                players[_current].trackId = trackId;
                players[_current].player.src = `${API}/tracks/${trackId}/stream`;
                if (playState)
                    players[_current].player.play();
                else
                    players[_current].player.pause();

                if (playState)
                    players[_current].player.play();

                prefetchNextTrack();
                prefetchPrevTrack();

                return true;
            },
            /**
             * Play track
             */
            play: () => {
                if (players[_current].player.src
                    && players[_current].player.src !== '') {
                    players[_current].player.play();
                    playState = true;
                }
            },
            /**
             * Pause track
             */
            pause: () => {
                players[_current].player.pause();
                playState = false;
            },
            /**
             * Check if player playing or paused
             * @returns true if playing, false if paused
             */
            getPlayPause: () => {
                return !players[_current].player.paused;
            },
            /**
             * Sets the volume for the player
             * @param {Number} volume number between 0.0 to 1.0 for audio volume
             */
            setVolume: (volume) => {
                players[_current].player.volume = volume;
                players[_next].player.volume = volume;
                players[_prev].player.volume = volume;
            },
            /**
             * Gets the current player
             * @returns current player instance
             */
            getPlayer: () => {
                return players[_current].player;
            },
            /**
             * Sets shuffle parameter for player.
             * @param {Boolean} _shuffle 
             */
            setShuffle: (_shuffle) => {
                shuffle = _shuffle;
            },
        };

    };

    return {
        getInstance: () => {
            if (!instance)
                instance = init();
            return instance;
        },
    };
})();

export default PlayerManager;