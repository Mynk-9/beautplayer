const QueueManager = {
    /**
     * Adds a new track to player queue.
     * 
     * @param {[]} playerQueue playerQueue definition can be found in 
     *                         PlayerContext
     * @param {{}} trackData data of the track, definition found in 
     *                      PlayerContext or TrackList
     * @param {Function} setter if setter is provided, changed queue is updated
     *                          using setter
     * @param {Function} next if provided, it will be executed after setter
     * @returns updated queue
     */
    addTrack: (playerQueue, trackData, setter, next) => {
        // remove the track from previous position to be added to front
        for (let i = 0; i < playerQueue.length; ++i) {
            let track = playerQueue[i];
            if (track.trackId === trackData.trackId) {
                playerQueue.splice(i, 1);
                break;
            }
        }
        playerQueue.push(trackData);

        if (setter) setter(playerQueue);
        if (next) next();

        return playerQueue;
    },

    /**
     * Adds a list of new tracks to player queue.
     * 
     * @param {[]} playerQueue playerQueue definition can be found in 
     *                         PlayerContext
     * @param {[]} trackDataList array of data of the tracks, definition found in 
     *                      PlayerContext or TrackList
     * @param {Function} setter if setter is provided, changed queue is updated
     *                          using setter
     * @param {Function} next if provided, it will be executed after setter
     * @returns updated queue
     */
    addTracksMany: (playerQueue, trackDataList, setter, next) => {
        let newData = [...playerQueue, ...trackDataList];
        let newDataSet = new Set(newData);
        
        if (setter) setter([...newDataSet]);
        if (next) next();

        return newDataSet;
    },

    /**
     * Removes a track from player queue.
     * 
     * @param {[]} playerQueue playerQueue definition can be found in 
     *                         PlayerContext
     * @param {String} trackId trackId of the track
     * @param {Function} setter if setter is provided, changed queue is updated
     *                          using setter
     * @param {Function} next if provided, it will be executed after setter
     * @returns updated queue
     */
    removeTrack: (playerQueue, trackId, setter, next) => {
        let queue = [...playerQueue];
        let i = 0;
        for (; i < playerQueue.length; ++i)
            if (trackId === queue[i].trackId)
                break;
        if (i >= playerQueue.length)
            return;
        queue.splice(i, 1);

        if (setter) setter(queue);
        if (next) next();

        return queue;
    },

    /**
     * Gets next track data.
     * 
     * @param {[]} playerQueue playerQueue definition can be found in 
     *                         PlayerContext
     * @param {String} currentTrack currentTrack is TrackId of current playing
     *                              track
     * @param {Function} setter if setter is provided, queue is passed to 
     *                          setter, otherwise returned
     * @param {Function} next if next is provided, it is called in the end with
     *                        value of next track passed
     * @param {boolean} shuffle shuffle enabled would randomly pick the next 
     *                          unplayed track
     * @returns picks the next track supposed to be played, returns track data,
     *          null on error
     */
    getNextTrack: (playerQueue, currentTrack, setter, next, shuffle) => {
        // get current track position
        let i = 0;
        let nextIndex = -1;
        for (i = 0; i < playerQueue.length; ++i)
            if (playerQueue[i].trackId === currentTrack)
                break;
        nextIndex = i + 1;

        if (nextIndex >= playerQueue.length) // check
            return null;

        if (shuffle) {  // shuffle
            let unplayedTracks = playerQueue.length - nextIndex;
            let randomIndex =
                nextIndex + Math.floor(Math.random() * unplayedTracks);
            // swap positions of next and the random track
            let tmp = playerQueue[nextIndex];
            playerQueue[nextIndex] = playerQueue[randomIndex];
            playerQueue[randomIndex] = tmp;
        }

        // update playerQueue if shuffled is enabled and setter provided
        if (shuffle && setter) setter(prev => [...playerQueue]);

        if (next) next();

        return playerQueue[nextIndex];
    },

    /**
     * Gets previous track data.
     * 
     * @param {[]} playerQueue playerQueue definition can be found in 
     *                         PlayerContext
     * @param {String} currentTrack currentTrack is TrackId of current playing
     *                              track
     * @returns previous track data, on error returns null
     */
    getPrevTrack: (playerQueue, currentTrack) => {
        let i = 0;
        for (i = 0; i < playerQueue.length; ++i)
            if (playerQueue[i].trackId === currentTrack)
                break;
        --i; // prev track
        if (i < 0 || i >= playerQueue.length) // check
            return null;
        return playerQueue[i];
    },

    /**
     * Clears the player queue.
     * 
     * @param {Function} setter setter function of playerQueue
     */
    clearQueue: (setter) => {
        setter([]);
    },
};

export default QueueManager;