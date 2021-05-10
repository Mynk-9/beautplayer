var PlayerManager = (() => {
    var instance;
    function init() {

        // prev track, current track, next track
        let players = [new Audio(), new Audio(), new Audio()];
        let _current = 0;
        let getCurrentPlayer = () => players[_current];
        let getNextPlayer = () => players[_current < 2 ? _current + 1 : 0];
        let getPrevPlayer = () => players[_current > 0 ? _current - 1 : 2];
        let updateCurrent = (moveAhead = true) => {
            if (moveAhead)
                _current = _current < 2 ? _current + 1 : 0;
            else
                _current = _current > 0 ? _current - 1 : 2;
        };


        return {
            /**
             * Sets the next song streaming url
             * @param {String} url stream url of next song
             */
            setNext: (url) => {
                getNextPlayer().src = url;
                _nextSet = true;
            },
            /**
             * Go to next track
             * @returns true if next playing, false if next not set
             */
            next: () => {
                getCurrentPlayer().pause();
                if (!getNextPlayer().src) return false;

                getNextPlayer().play();
                updateCurrent(true);
                return true;
            },
            /**
             * Go to prev track
             */
            prev: () => {
                getCurrentPlayer().pause();
                if (!getPrevPlayer().src) return false;

                getPrevPlayer().play();
                updateCurrent(false);
                return true;
            },
            /**
             * Play track
             */
            play: () => {
                getCurrentPlayer().play();
            },
            /**
             * Pause track
             */
            pause: () => {
                getCurrentPlayer().pause();
            },
            /**
             * Check if player playing or paused
             * @returns true if playing, false if paused
             */
            getPlayPause: () => {
                return !getCurrentPlayer().paused;
            },
            /**
             * Sets the volume for the player
             * @param {Number} volume number between 0.0 to 1.0 for audio volume
             */
            setVolume: (volume) => {
                getCurrentPlayer().volume = volume;
                getNextPlayer().volume = volume;
                getPrevPlayer().volume = volume;
            },
            /**
             * Gets the current player
             * @returns current player instance
             */
            getPlayer: () => {
                return getCurrentPlayer();
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