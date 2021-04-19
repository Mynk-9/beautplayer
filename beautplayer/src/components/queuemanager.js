export default {
    // playerQueue and trackData definitions can be found in PlayerContext
    // if setter is provided, queue is passed to setter, otherwise returned
    // if next is provided, it is called in the end
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
        else return queue;

        if (next) next();
    },
};