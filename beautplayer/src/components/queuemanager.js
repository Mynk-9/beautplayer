import BeautPlayerQueue from "./queue";
import PlayerManager from "./playermanager";

const QueueManager = {
    /**
     * Adds a new track to player BeautPlayerQueue.queue.
     * 
     * @param {{}} trackData data of the track, definition found in 
     *                      PlayerContext or TrackList
     */
    addTrack: (trackData) => {
        // remove the track from previous position to be added to front
        for (let i = 0; i < BeautPlayerQueue.queue.length; ++i) {
            let track = BeautPlayerQueue.queue[i];
            if (track.trackId === trackData.trackId) {
                BeautPlayerQueue.queue.splice(i, 1);
                break;
            }
        }
        BeautPlayerQueue.queue.push(trackData);
        PlayerManager.getInstance().forcePrefetch();
    },

    /**
     * Adds a list of new tracks to player BeautPlayerQueue.queue.
     * 
     * @param {[]} trackDataList array of data of the tracks, definition found in 
     *                      PlayerContext or TrackList
     * @returns updated BeautPlayerQueue.queue
     */
    addTracksMany: (trackDataList) => {
        let newData = [...BeautPlayerQueue.queue, ...trackDataList];
        let newDataSet = new Set(newData);
        BeautPlayerQueue.queue = [...newDataSet];
        PlayerManager.getInstance().forcePrefetch();
    },

    /**
     * Removes a track from player BeautPlayerQueue.queue.
     * 
     * @param {String} trackId trackId of the track
     */
    removeTrack: (trackId) => {
        let i = 0;
        for (; i < BeautPlayerQueue.queue.length; ++i)
            if (trackId === BeautPlayerQueue.queue[i].trackId)
                break;
        if (i >= BeautPlayerQueue.queue.length)
            return;
        BeautPlayerQueue.queue.splice(i, 1);
        PlayerManager.getInstance().forcePrefetch();
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
        for (i = 0; i < BeautPlayerQueue.queue.length; ++i)
            if (BeautPlayerQueue.queue[i].trackId === currentTrack)
                break;
        nextIndex = i + 1;

        if (nextIndex >= BeautPlayerQueue.queue.length) // check
            return null;

        if (shuffle) {  // shuffle
            let unplayedTracks = BeautPlayerQueue.queue.length - nextIndex;
            let randomIndex =
                nextIndex + Math.floor(Math.random() * unplayedTracks);
            // swap positions of next and the random track
            let tmp = BeautPlayerQueue.queue[nextIndex];
            BeautPlayerQueue.queue[nextIndex] = BeautPlayerQueue.queue[randomIndex];
            BeautPlayerQueue.queue[randomIndex] = tmp;
        }

        return BeautPlayerQueue.queue[nextIndex];
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
        for (i = 0; i < BeautPlayerQueue.queue.length; ++i)
            if (BeautPlayerQueue.queue[i].trackId === currentTrack)
                break;
        --i; // prev track
        if (i < 0 || i >= BeautPlayerQueue.queue.length) // check
            return null;
        return BeautPlayerQueue.queue[i];
    },

    /**
     * Clears the player BeautPlayerQueue.queue.
     */
    clearQueue: () => {
        BeautPlayerQueue.queue = [];
    },

    /**
     * Check if track is present in the BeautPlayerQueue.queue
     * 
     * @param {String} trackId 
     * @returns true if track is present in the BeautPlayerQueue.queue, false otherwise
     */
    checkQueue: (trackId) => {
        for (let i = 0; i < BeautPlayerQueue.queue.length; ++i)
            if (trackId === BeautPlayerQueue.queue[i].trackId)
                return true;
        return false;
    },
};

export default QueueManager;