import QueueManager from './queuemanager';
import API from './apiLink';

var PlayerManager = (() => {
    var instance;
    function init() {

        // private members

        // audio context
        let AudioContext = window.AudioContext;
        if (!AudioContext)
            AudioContext = window.webkitAudioContext;
        const audioContext = new AudioContext({
            latencyHint: 'playback',
        });


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

        // private variables for player state
        let _current = 0;
        let _next = 1;
        let _prev = 2;
        let shuffle = false;
        let loop = false;
        let volume = 1.0;
        let globalPlayState = false;
        let crossfade = true;
        let crossfadePlaylist = true;
        let crossfadeNextPrev = true;
        let playPauseFade = true;
        let crossfadeDuration = 5;
        let onTimeUpdateHandler = () => { };
        let onTimeUpdateHandlerExec = false;
        let verboseLog = false;
        const updateCurrentIndex = (moveAhead = true) => {
            if (moveAhead)
                _current = _current < 2 ? _current + 1 : 0;
            else
                _current = _current > 0 ? _current - 1 : 2;

            _next = _current < 2 ? _current + 1 : 0;
            _prev = _current > 0 ? _current - 1 : 2;
        };

        // logging function
        const makeLog = (...log) => {
            if (!verboseLog) return;
            let prefix = 'Player Manager:';
            console.log(prefix, ...log);
        };

        // tracks prefetch management functions
        /**
         * Prefetch the next track. Track details fetched from player queue.
         */
        const prefetchNextTrack = () => {
            let nextTrack = QueueManager.getNextTrack(players[_current].trackId, shuffle);
            let nextTrackId = nextTrack?.trackId;
            let duration = nextTrack?.audioDuration.split(':');

            if (nextTrackId && players[_next].trackId !== nextTrackId) {
                players[_next].trackId = nextTrackId;

                players[_next].sourceNode.mediaElement.setAttribute(
                    'data-duration',
                    parseFloat(duration[0]) * 60 + parseFloat(duration[1])
                );
                players[_next].sourceNode.mediaElement.src =
                    `${API}/tracks/${nextTrackId}/stream`;
                players[_next].sourceNode.mediaElement.pause();
            }
        };
        /**
         * Prefetch the previous track. Track details fetched from player queue.
         */
        const prefetchPrevTrack = () => {
            let prevTrack = QueueManager.getPrevTrack(players[_current].trackId);
            let prevTrackId = prevTrack?.trackId;
            let duration = prevTrack?.audioDuration.split(':');

            if (prevTrackId && players[_prev].trackId !== prevTrackId) {
                players[_prev].trackId = prevTrackId;

                players[_prev].sourceNode.mediaElement.setAttribute(
                    'data-duration',
                    parseFloat(duration[0]) * 60 + parseFloat(duration[1])
                );
                players[_prev].sourceNode.mediaElement.src =
                    `${API}/tracks/${prevTrackId}/stream`;
                players[_prev].sourceNode.mediaElement.pause();
            }
        };

        // HTMLAudioElement play state management functions for 
        // working with async calls
        /**
         * Sets and returns play state of individual player
         * @param {{}} player object as present in players array
         * @returns {Number} stateId
         */
        const setLocalPlayState = (player = players[_current]) => {
            let stateId = parseInt(
                player.sourceNode.mediaElement.getAttribute('play-state')
            );
            if (isNaN(stateId))
                stateId = 0;
            else
                stateId++;
            player.sourceNode.mediaElement.setAttribute('play-state', String(stateId));
            return stateId;
        };
        /**
         * Gets play state of individual player
         * @param {{}} player object as present in players array
         * @returns {Number} stateId
         */
        const getLocalPlayState = (player = players[_current]) => {
            return parseInt(player.sourceNode.mediaElement.getAttribute('play-state'));
        };
        /**
         * Compares current state with a previous stateId
         * @param {{}} player object as present in players array
         * @param {Number} oldState previous stateId
         * @returns {Boolean} true if states are same, false otherwise
         */
        const compareCurrentLocalState = (player = players[_current], oldState) => {
            makeLog('newState:', getLocalPlayState(player), 'oldState:', oldState);
            return (getLocalPlayState(player) === oldState);
        };

        // player play/pause management functions
        /**
         * Pauses the player
         * @param {{}} conf Object with the following properties: 
         *        player: denotes the player object as present in players array
         *                  defaults to current player if not provided
         *        autoSwitch: denotes that operation is part of playlist auto
         *                  next, defaults to false
         *        crossfade: denotes crossfade enable/disable boolean for this 
         *                  operation, if not provided, it will set according 
         *                  existing settings of crossfade
         * @returns {MediaElementAudioSourceNode} source node of player object
         */
        const handlePlayerPause = async (conf) => {
            const getValOrDefault = (val, def) => {
                // catch both null and undefined
                if (val == null)
                    return def;
                return val;
            };

            let player = getValOrDefault(conf['player'], players[_current]);
            makeLog('pause', player.sourceNode.mediaElement.getAttribute('data-duration'));
            let autoSwitch = getValOrDefault(conf['autoSwitch'], false);
            let _crossfade = getValOrDefault(
                conf['crossfade'],
                (crossfade && (crossfadeNextPrev || (autoSwitch && crossfadePlaylist)))
            );

            let localPlayState = setLocalPlayState(player);

            if (_crossfade) {
                player.gainNode.gain.cancelAndHoldAtTime(audioContext.currentTime);
                player
                    .gainNode
                    .gain
                    .setTargetAtTime(
                        0,
                        audioContext.currentTime,
                        crossfadeDuration / 5
                    );
                await new Promise(r => setTimeout(r, crossfadeDuration * 1000));
            }
            if (compareCurrentLocalState(player, localPlayState)) {
                makeLog('pausing for:',
                    'autoSwitch:', autoSwitch,
                    'playState:', localPlayState,
                    'player:', player.sourceNode.mediaElement.getAttribute('data-duration')
                );

                player.sourceNode.mediaElement.pause();
            } else {
                makeLog('NOT pausing for:',
                    'autoSwitch:', autoSwitch,
                    'playState:', localPlayState,
                    'player:', player.sourceNode.mediaElement.getAttribute('data-duration')
                );
            }

            return player.sourceNode;
        };
        /**
         * Plays/Resumes the player
         * @param {{}} conf Object with the following properties: 
         *        player: denotes the player object as present in players array
         *                  defaults to current player if not provided
         *        autoSwitch: denotes that operation is part of playlist auto
         *                  next, defaults to false
         *        crossfade: denotes crossfade enable/disable boolean for this 
         *                  operation, if not provided, it will set according 
         *                  existing settings of crossfade
         * @returns {MediaElementAudioSourceNode} source node of player object
         */
        const handlePlayerPlay = async (conf) => {
            const getValOrDefault = (val, def) => {
                // catch both null and undefined
                if (val == null)
                    return def;
                return val;
            };

            let player = getValOrDefault(conf['player'], players[_current]);
            makeLog('play', player.sourceNode.mediaElement.getAttribute('data-duration'));
            let autoSwitch = getValOrDefault(conf['autoSwitch'], false);
            let _crossfade = getValOrDefault(
                conf['crossfade'],
                (crossfade && (crossfadeNextPrev || (autoSwitch && crossfadePlaylist)))
            );

            let localPlayState = setLocalPlayState(player);

            if (_crossfade) {
                if (player.sourceNode.mediaElement.currentTime === 0)
                    player.gainNode.gain.value = 0.0;

                player.gainNode.gain.cancelAndHoldAtTime(audioContext.currentTime);

                player
                    .gainNode
                    .gain
                    .setTargetAtTime(
                        volume,
                        audioContext.currentTime,
                        crossfadeDuration / 5
                    );
                player.sourceNode.mediaElement.play();
                await new Promise(r => setTimeout(r, crossfadeDuration * 1000));
                makeLog('final vol:', player.gainNode.gain.value);
            } else {
            }

            if (compareCurrentLocalState(player, localPlayState)) {
                // player.gainNode.gain.cancelScheduledValues(0);
                // player.gainNode.gain.value = volume;
                player.sourceNode.mediaElement.play();
            }

            return player.sourceNode;
        };


        // public members

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
            next: (autoSwitch = false) => {
                if (!players[_next].sourceNode.mediaElement.src
                    || players[_next].sourceNode.mediaElement.src === '') {
                    handlePlayerPause({
                        player: players[_current],
                    }).then(({ mediaElement }) => {
                        mediaElement.ontimeupdate = () => { };
                    });
                    return false;
                }

                handlePlayerPause({
                    player: players[_current],
                    autoSwitch: autoSwitch,
                }).then(({ mediaElement }) => {
                    // mediaElement.currentTime = 0;
                    mediaElement.ontimeupdate = () => { };
                });
                if (globalPlayState) {
                    players[_next].sourceNode.mediaElement.currentTime = 0;
                    handlePlayerPlay({
                        player: players[_next],
                        autoSwitch: autoSwitch,
                    }).then(({ mediaElement }) => {
                        mediaElement.ontimeupdate = onTimeUpdateHandler;
                        onTimeUpdateHandlerExec = false;
                    });
                }

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
            prev: (autoSwitch = false) => {
                if (!players[_prev].sourceNode.mediaElement.src
                    || players[_prev].sourceNode.mediaElement.src === '') {
                    handlePlayerPause({
                        player: players[_current],
                    }).then(({ mediaElement }) => {
                        mediaElement.ontimeupdate = () => { };
                    });
                    return false;
                }

                handlePlayerPause({
                    player: players[_current],
                    autoSwitch: autoSwitch,
                }).then(({ mediaElement }) => {
                    // mediaElement.currentTime = 0;
                    mediaElement.ontimeupdate = () => { };
                });
                if (globalPlayState) {
                    players[_prev].sourceNode.mediaElement.currentTime = 0;
                    handlePlayerPlay({
                        player: players[_prev],
                        autoSwitch: autoSwitch,
                    }).then(({ mediaElement }) => {
                        mediaElement.ontimeupdate = onTimeUpdateHandler;
                        onTimeUpdateHandlerExec = false;
                    });
                }

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
            setCurrentTrack: (trackId, duration) => {
                if (!trackId || trackId === '')
                    return false;
                if (!QueueManager.checkQueue(trackId))
                    return false;

                // let playState = !players[_current].sourceNode.mediaElement.paused;
                players[_current].trackId = trackId;
                players[_current].sourceNode.mediaElement.setAttribute(
                    'data-duration', duration
                );
                players[_current].sourceNode.mediaElement.src = `${API}/tracks/${trackId}/stream`;
                if (globalPlayState)
                    players[_current].sourceNode.mediaElement.play();
                else
                    players[_current].sourceNode.mediaElement.pause();

                if (globalPlayState)
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
                    handlePlayerPlay({
                        player: players[_current],
                        crossfade: playPauseFade,
                    })
                        .then(({ mediaElement }) => {
                            mediaElement.ontimeupdate = onTimeUpdateHandler;
                            onTimeUpdateHandlerExec = false;
                        });
                    globalPlayState = true;
                }
            },
            /**
             * Pause track
             */
            pause: () => {
                handlePlayerPause({
                    player: players[_current],
                    crossfade: playPauseFade,
                })
                    .then(({ mediaElement }) => {
                        mediaElement.ontimeupdate = () => { };
                    });
                globalPlayState = false;
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
             * On track end event function call. Behaviour dependent on crossfade.
             * If crossfade and playlist-crossfade are enabled and track is not
             * on loop, then the function would be called x seconds earlier than
             * track end, where x is crossfade duration. Otherwise, function 
             * will be called when track ends if track is not on loop.
             * @param {Function} func 
             */
            setOnTrackEnd: (func) => {
                onTimeUpdateHandler = (e) => {
                    if (!crossfade || !crossfadePlaylist || loop) return;
                    let _audio = e.currentTarget;
                    let _currentTime = _audio.currentTime;
                    let _duration = parseFloat(_audio.getAttribute('data-duration'));
                    // ready state = 4 means that enough the data is loaded
                    let isReady = _audio.readyState === 4;
                    if (isReady && _duration
                        && Math.round(_duration - _currentTime) <= crossfadeDuration
                        && !onTimeUpdateHandlerExec
                    ) {
                        onTimeUpdateHandlerExec = true;
                        _audio.ontimeupdate = () => { };
                        func();
                    }
                };
                // onTimeUpdateHandler = () => { };

                players[_current].sourceNode.mediaElement.ontimeupdate = onTimeUpdateHandler;
                players[_current].sourceNode.mediaElement.onended = () => {
                    if (crossfade) return;
                    func();
                };
            },
            /**
             * 
             * @param {Boolean} _crossfade set crossfade enabled/disabled, 
             *                default true
             * @param {Boolean} _crossfadeNextPrev if crossfade is enabled, set 
             *                crossfade on next/prev button press, default true
             * @param {Boolean} _crossfadePlaylist if crossfade is enabled, set 
             *                crossfade on playlist track change, default true
             * @param {Number} _crossfadeDuration if crossfade is enabled, set 
             *                duration of crossfade, default 1.0 sec
             */
            setCrossfade: ({
                _crossfade,
                _crossfadePlaylist,
                _crossfadeNextPrev,
                _crossfadeDuration,
            }) => {
                const getNotNullElseDefault = (val, defVal) => {
                    if (val === true || val === false) return val;
                    if (isFinite(val)) return val;
                    return defVal;
                };
                makeLog(
                    getNotNullElseDefault(_crossfade, crossfade),
                    getNotNullElseDefault(_crossfadePlaylist, crossfadePlaylist),
                    getNotNullElseDefault(_crossfadeNextPrev, crossfadeNextPrev),
                    getNotNullElseDefault(_crossfadeDuration, crossfadeDuration)
                );

                const isBool = (val) => (val === true || val === false);
                if (isBool(_crossfade))
                    crossfade = _crossfade;
                if (isBool(_crossfadePlaylist))
                    crossfadePlaylist = _crossfadePlaylist;
                if (isBool(_crossfadeNextPrev))
                    crossfadeNextPrev = _crossfadeNextPrev;
                if (isFinite(_crossfadeDuration))
                    crossfadeDuration = parseFloat(_crossfadeDuration);
            },
            /**
             * Gets the crossfade parameters
             * @returns Object:
             *      crossfade: (crossfade in general),
             *      crossfadeNextPrev: (crossfade for next/prev buttons), 
             *      crossfadePlaylist: (crossfade for playlist playing), 
             *      crossfadeDuration: (crossfade duration in seconds)
             */
            getCrossfade: () => {
                return {
                    crossfade: crossfade,
                    crossfadeNextPrev: crossfadeNextPrev,
                    crossfadePlaylist: crossfadePlaylist,
                    crossfadeDuration: crossfadeDuration,
                };
            },
            /**
             * Sets if track should fade when pressed play/pause button. Fade 
             * duration is same as crossfade duration.
             * @param {Boolean} _playPauseFade Boolean for enable/disable
             */
            setPlayPauseFade: (_playPauseFade) => {
                if (_playPauseFade === true || _playPauseFade === false)
                    playPauseFade = _playPauseFade;
            },
            /**
             * Gets current state of play/pause fade.
             * @returns {Boolean} true if enabled, false otherwise
             */
            getPlayPauseFade: () => playPauseFade,
            /**
             * Sets verbose logging
             * @param {Boolean} verbose enable/disable
             */
            setVerbose: (verbose) => {
                if (verbose === true || verbose === false)
                    verboseLog = verbose;
            },
            /**
             * Gets verbose logging
             * @returns {Boolean} verbose logging enabled/disabled
             */
            getVerbose: () => verboseLog,
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