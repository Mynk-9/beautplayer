const express = require('express');
const router = express.Router();
const mm = require('music-metadata');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const Tracks = require('../models/tracks');

// handle GET to /coverArt/:trackId
router.get('/:trackId', (req, res, next) => {
    const id = req.params.trackId;
    Tracks.findById(id)
        .then(track => {
            const filePath = track.path;
            mm.parseFile(filePath)
                .then(metadata => {
                    let imageData = metadata.common.picture[0].data;
                    res.status(200).json({
                        coverArt: imageData
                    });
                })
                .catch(e => {
                    res.status(500).json({
                        error: e
                    });
                });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

// handle GET to /coverArt/compressed/:trackID
router.get('/compressed/:trackId', (req, res, next) => {
    const id = req.params.trackId;
    Tracks.findById(id)
        .then(track => {
            const filePath = track.path;
            mm.parseFile(filePath)
                .then(async metadata => {
                    let imageData = metadata.common.picture[0].data;
                    console.log(metadata.common.picture[0].format);
                    let compressedImage = await imagemin.buffer(imageData, {
                        plugins: [
                            imageminMozjpeg({ quality: 10 })
                        ]
                    });
                    res.set({
                        'Cache-Control': 'max-age=86400' // seconds in a day
                    });
                    res.status(200).json({
                        coverArt: compressedImage
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

module.exports = router;