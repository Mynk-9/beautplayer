const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const PlaylistTracks = require('../models/playlistTracks');

// handle GET to /playlistTracks
router.get('/', (req, res, next) => {
    PlaylistTracks.find()
        .exec()
        .then(lists => {
            res.status(200).json({
                Playlists: lists.map(list => {
                    return {
                        trackId: list.trackId,
                        playlistName: list.playlistName
                    };
                })
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

router.get('/:playlistName', (req, res, next) => {
    const plName = req.params.playlistName;
    PlaylistTracks.find({ playlistName_lower: plName.toLowerCase() })
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

router.get('/:playlistName/:trackId', (req, res, next) => {
    const plName = req.params.playlistName;
    const trackId = req.params.trackId;
    PlaylistTracks.find({ playlistName_lower: plName.toLowerCase(), trackId: trackId })
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

// handle POST requests on /playlistTracks
router.post('/', (req, res, next) => {
    const track = new PlaylistTracks({
        _id: new mongoose.Types.ObjectId(),
        trackId: req.body.trackId,
        playlistName: req.body.playlistName,
        playlistName_lower: req.body.playlistName.toLowerCase()
    });

    track
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Added to playlist successfully.',
                systemMessage: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Encountered an error',
                error: err
            });
        });
});

// handle DELETE requests on /playlistTracks
router.delete('/', (req, res, next) => {
    const trackId = req.body.trackId;
    const playlistName = req.body.playlistName;

    PlaylistTracks
        .deleteMany({ trackId: trackId, playlistName_lower: playlistName.toLowerCase() })
        .then(result => {
            if (result.deletedCount > 0)
                res.status(200).json({
                    message: 'Removed successfully.',
                    systemMessage: result
                });
            else
                res.status(404).json({
                    message: 'Encountered an error',
                    error: result
                });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Encountered an error',
                error: err
            });
        });
});

router.delete('/')

module.exports = router;