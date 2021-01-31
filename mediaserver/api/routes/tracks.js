const fs = require('fs');
const express = require('express');
const router = express.Router();
const Tracks = require('./../models/tracks');

// handle GET to /tracks
router.get('/', (req, res, next) => {
    Tracks.find()
        .exec()
        .then(tracks => {
            res.status(200).json({
                TrackList: tracks
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

router.get('/:trackId', (req, res, next) => {
    const id = req.params.trackId;
    Tracks.findById(id)
        .then(track => {
            res.status(200).json({
                Track: track
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

// for streaming
router.get('/:trackId/stream', (req, res, next) => {
    const id = req.params.trackId;
    Tracks.findById(id)
        .then(track => {

            // code analysed picked from https://gist.github.com/DingGGu/8144a2b96075deaf1bac

            let music = '';
            music = track['path'];

            let stat = fs.statSync(music);
            range = req.headers.range;
            let readStream;

            if (range !== undefined) {
                let parts = range.replace(/bytes=/, "").split("-");

                let partial_start = parts[0];
                let partial_end = parts[1];

                if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
                    return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
                }

                let start = parseInt(partial_start, 10);
                let end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
                let content_length = (end - start) + 1;

                res.status(206).header({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': content_length,
                    'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
                });

                readStream = fs.createReadStream(music, { start: start, end: end });
            } else {
                res.header({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size
                });
                readStream = fs.createReadStream(music);
            }
            readStream.pipe(res);

        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

module.exports = router;