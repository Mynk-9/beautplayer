import queue from './queue';

const QueueManager = {
    /**
     * Adds a new track to player queue.
     * 
     * @param {{}} trackData data of the track, definition found in 
     *                      PlayerContext or TrackList
     */
    addTrack: (trackData) => {
        // remove the track from previous position to be added to front
        for (let i = 0; i < queue.length; ++i) {
            let track = queue[i];
            if (track.trackId === trackData.trackId) {
                queue.splice(i, 1);
                break;
            }
        }
        queue.push(trackData);
    },

    /**
     * Adds a list of new tracks to player queue.
     * 
     * @param {[]} trackDataList array of data of the tracks, definition found in 
     *                      PlayerContext or TrackList
     * @returns updated queue
     */
    addTracksMany: (trackDataList) => {
        let newData = [...queue, ...trackDataList];
        let newDataSet = new Set(newData);
        queue = [...newDataSet];
    },

    /**
     * Removes a track from player queue.
     * 
     * @param {String} trackId trackId of the track
     */
    removeTrack: (trackId) => {
        let i = 0;
        for (; i < queue.length; ++i)
            if (trackId === queue[i].trackId)
                break;
        if (i >= queue.length)
            return;
        queue.splice(i, 1);
    },

    /**
     * Gets next track data.
     * 
     * @param {String} currentTrack currentTrack is TrackId of current playing
     *                              track
     * @param {boolean} shuffle shuffle enabled would randomly pick the next 
     *                          unplayed track
     * @returns picks the next track supposed to be played, returns track data,
     *          null on error
     */
    getNextTrack: (currentTrack, shuffle) => {
        // get current track position
        let i = 0;
        let nextIndex = -1;
        for (i = 0; i < queue.length; ++i)
            if (queue[i].trackId === currentTrack)
                break;
        nextIndex = i + 1;

        if (nextIndex >= queue.length) // check
            return null;

        if (shuffle) {  // shuffle
            let unplayedTracks = queue.length - nextIndex;
            let randomIndex =
                nextIndex + Math.floor(Math.random() * unplayedTracks);
            // swap positions of next and the random track
            let tmp = queue[nextIndex];
            queue[nextIndex] = queue[randomIndex];
            queue[randomIndex] = tmp;
        }

        return queue[nextIndex];
    },

    /**
     * Gets previous track data.
     * 
     * @param {String} currentTrack currentTrack is TrackId of current playing
     *                              track
     * @returns previous track data, on error returns null
     */
    getPrevTrack: (currentTrack) => {
        let i = 0;
        for (i = 0; i < queue.length; ++i)
            if (queue[i].trackId === currentTrack)
                break;
        --i; // prev track
        if (i < 0 || i >= queue.length) // check
            return null;
        return queue[i];
    },

    /**
     * Clears the player queue.
     */
    clearQueue: () => {
        queue = [];
    },

    /**
     * Check if track is present in the queue
     * 
     * @param {String} trackId 
     * @returns true if track is present in the queue, false otherwise
     */
    checkQueue: (trackId) => {
        for (let i = 0; i < queue.length; ++i)
            if (trackId === queue[i].trackId)
                return true;
        return false;
    },
};

export default QueueManager;