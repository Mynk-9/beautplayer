import QueueManager from './queuemanager';

var PlayerManager = (() => {
    var instance;
    function init() {

        // audio context
        let AudioContext = window.AudioContext;// || window.webkitAudioContext;
        if (!AudioContext)
            AudioContext = window.webkitAudioContext;
        const audioContext = new AudioContext();

        // prev track, current track, next track
        let players = [
            {
                trackId: null,
                sourceNode: audioContext.createMediaElementSource(new Audio()),
                gainNode: audioContext.createGain(),
            },
            {
                trackId: null,
                sourceNode: audioContext.createMediaElementSource(new Audio()),
                gainNode: audioContext.createGain(),
            },
            {
                trackId: null,
                sourceNode: audioContext.createMediaElementSource(new Audio()),
                gainNode: audioContext.createGain(),
            },
        ];

        // init the nodes
        players.forEach(({ sourceNode, gainNode }) => {
            sourceNode.mediaElement.volume = 1;
            sourceNode.mediaElement.crossOrigin = 'anonymous';
            sourceNode.mediaElement.preload = 'auto';
            gainNode.gain.value = 1;

            sourceNode
                .connect(gainNode)
                .connect(audioContext.destination);
        });

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
                players[_next].sourceNode.mediaElement.src =
                    `${API}/tracks/${nextTrackId}/stream`;
                players[_next].sourceNode.mediaElement.pause();
            }
        };
        const prefetchPrevTrack = () => {
            let prevTrackId =
                QueueManager.getPrevTrack(players[_current].trackId)?.trackId;
            if (prevTrackId && players[_prev].trackId !== prevTrackId) {
                players[_prev].trackId = prevTrackId;
                players[_prev].sourceNode.mediaElement.src =
                    `${API}/tracks/${prevTrackId}/stream`;
                players[_prev].sourceNode.mediaElement.pause();
            }
        };

        const handlePlayerPause = async (player = players[_current], _crossFade = crossFade) => {
            // TODO: Implement crossfade
            player.sourceNode.mediaElement.pause();

            return player.sourceNode;
        };
        const handlePlayerPlay = async (player = players[_current], _crossFade = crossFade) => {
            // TODO: Implement crossfade
            player.sourceNode.mediaElement.play();

            return player.sourceNode;
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
                if (!players[_next].sourceNode.mediaElement.src
                    || players[_next].sourceNode.mediaElement.src === '') {
                    handlePlayerPause(players[_current], false);
                    return false;
                }

                handlePlayerPause(players[_current]).then(({ mediaElement }) => {
                    mediaElement.currentTime = 0;
                });
                if (playState)
                    handlePlayerPlay(players[_next]);

                players[_next].sourceNode.mediaElement.onended =
                    players[_current].sourceNode.mediaElement.onended;
                players[_current].sourceNode.mediaElement.onended = () => { };

                updateCurrentIndex(true);
                prefetchNextTrack();

                return true;
            },
            /**
             * Go to prev track
             */
            prev: () => {
                if (!players[_prev].sourceNode.mediaElement.src
                    || players[_prev].sourceNode.mediaElement.src === '') {
                    handlePlayerPause(players[_current], false);
                    return false;
                }

                handlePlayerPause(players[_current]).then(({ mediaElement }) => {
                    mediaElement.currentTime = 0;
                });
                if (playState)
                    handlePlayerPlay(players[_prev]);

                players[_prev].sourceNode.mediaElement.onended =
                    players[_current].sourceNode.mediaElement.onended;
                players[_current].sourceNode.mediaElement.onended = () => { };

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

                let playState = !players[_current].sourceNode.mediaElement.paused;
                players[_current].trackId = trackId;
                players[_current].sourceNode.mediaElement.src = `${API}/tracks/${trackId}/stream`;
                if (playState)
                    players[_current].sourceNode.mediaElement.play();
                else
                    players[_current].sourceNode.mediaElement.pause();

                if (playState)
                    players[_current].sourceNode.mediaElement.play();

                prefetchNextTrack();
                prefetchPrevTrack();

                return true;
            },
            /**
             * Play track
             */
            play: () => {
                // due to autoplay policy
                if (audioContext.state === 'suspended')
                    audioContext.resume();

                if (players[_current].sourceNode.mediaElement.src
                    && players[_current].sourceNode.mediaElement.src !== '') {
                    handlePlayerPlay(players[_current], false);
                    playState = true;
                }
            },
            /**
             * Pause track
             */
            pause: () => {
                handlePlayerPause(players[_current], false);
                playState = false;
            },
            /**
             * Check if player playing or paused
             * @returns true if playing, false if paused
             */
            getPlayPause: () => {
                return !players[_current].sourceNode.mediaElement.paused;
            },
            /**
             * Sets the volume for the player
             * @param {Number} volume number between 0.0 to 1.0 for audio volume
             */
            setVolume: (_volume) => {
                players.forEach(({ gainNode }) =>
                    gainNode.gain.value = _volume
                );
                volume = _volume;
            },
            /**
             * Gets the current player
             * @returns current player instance
             */
            getPlayer: () => {
                return players[_current].sourceNode.mediaElement;
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
                players.forEach(({ sourceNode }) =>
                    sourceNode.mediaElement.loop = _loop
                );
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
                players[_current].sourceNode.mediaElement.onended = func;
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