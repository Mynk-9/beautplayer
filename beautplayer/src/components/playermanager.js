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
        let loop = false;
        let volume = 1.0;
        let playState = false;
        let crossFade = false;
        let crossFadeDuration = 500;
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

        const handlePlayerPause = async (player, _crossFade = crossFade) => {
            if (_crossFade) {
                let steps = (crossFadeDuration / 20) - 1;
                let delta = (player.volume - 0) * 20 / crossFadeDuration;
                for (let i = 0; i < steps; ++i) {
                    let newVol = player.volume - delta;
                    if (newVol <= 1.0 && newVol >= 0.0)
                        player.volume = newVol;
                    await new Promise(r => setTimeout(r, 20));
                }
                player.volume = 0;
            }
            player.pause();
            player.volume = volume;

            return player;
        };
        const handlePlayerPlay = async (player, _crossFade = crossFade) => {
            if (_crossFade) {
                player.volume = 0;
                player.play();
                let steps = (crossFadeDuration / 20) - 1;
                let delta = (volume - player.volume) * 20 / crossFadeDuration;
                for (let i = 0; i < steps; ++i) {
                    let newVol = player.volume + delta;
                    if (newVol <= 1.0 && newVol >= 0.0)
                        player.volume = newVol;
                    await new Promise(r => setTimeout(r, 20));
                }
                player.volume = volume;
            } else {
                player.volume = volume;
                player.play();
            }

            return player;
        };


        return {
            /**
             * Force prefetch next track if not yet prefetched
             */
            forcePrefetch: () => {
                prefetchNextTrack();
                prefetchPrevTrack();
            },
            /**
             * Go to next track
             * @returns true if next playing, false if next not set
             */
            next: () => {
                if (!players[_next].player.src
                    || players[_next].player.src === '') {
                    handlePlayerPause(players[_current].player, false);
                    return false;
                }

                handlePlayerPause(players[_current].player).then(player => {
                    player.currentTime = 0;
                });
                if (playState)
                    handlePlayerPlay(players[_next].player);

                players[_next].player.onended = players[_current].player.onended;
                players[_current].player.onended = () => { };

                updateCurrentIndex(true);
                prefetchNextTrack();

                return true;
            },
            /**
             * Go to prev track
             */
            prev: () => {
                if (!players[_prev].player.src
                    || players[_prev].player.src === '') {
                    handlePlayerPause(players[_current].player, false);
                    return false;
                }

                handlePlayerPause(players[_current].player).then(player => {
                    player.currentTime = 0;
                });
                if (playState)
                    handlePlayerPlay(players[_prev].player);

                players[_prev].player.onended = players[_current].player.onended;
                players[_current].player.onended = () => { };

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
                    handlePlayerPlay(players[_current].player, false);
                    playState = true;
                }
            },
            /**
             * Pause track
             */
            pause: () => {
                handlePlayerPause(players[_current].player, false);
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
            setVolume: (_volume) => {
                players.forEach(({ player }) => player.volume = _volume);
                volume = _volume;
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
            /**
             * Shuffle true/false
             * @returns bool
             */
            getShuffle: () => shuffle,
            /**
             * Sets loop parameter for player.
             * @param {Boolean} _loop 
             */
            setLoop: (_loop) => {
                loop = _loop;
                players.forEach(({ player }) => player.loop = _loop);
            },
            /**
             * Loop true/false
             * @returns bool
             */
            getLoop: () => loop,
            /**
             * On track end event function call.
             * @param {Function} func 
             */
            setOnTrackEnd: (func) => {
                players[_current].player.onended = func;
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