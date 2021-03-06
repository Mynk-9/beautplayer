const express = require('express');
const router = express.Router();
const Playlists = require('../models/playlists');
const playlistArtGenerator = require('./../subroutines/playlistArtGenerator');

// handle GET to /playlists
router.get('/', (req, res, next) => {
    Playlists
        .find()
        .exec()
        .then(playlists => {
            res.status(200).json({
                Playlists: playlists
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

// handle GET to /playlists:playlistName
router.get('/:playlistName', (req, res, next) => {
    const plName = req.params.playlistName;
    Playlists
        .findById(plName)
        .populate('tracks')
        .then(playlist => {
            res.status(200).json({
                Playlist: playlist
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

// handle GET to /playlists/:playlistName/:trackId
router.get('/:playlistName/:trackId', (req, res, next) => {
    const plName = req.params.playlistName;
    const trackId = req.params.trackId;
    Playlists
        .count(
            { _id: plName, tracks: { $in: [trackId] } }
        )
        .then(count => {
            res.status(200).json({
                found: (count > 0 ? true : false)
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

// handle POST requests on /playlists
router.post('/', async (req, res, next) => {
    const playList = req.body.playlistName;
    const trackId = req.body.trackId;

    Playlists
        .findOneAndUpdate(
            { _id: playList },
            { $addToSet: { tracks: trackId } },
            {
                upsert: true,
                new: true,
                useFindAndModify: false
            }
        )
        .then(track => {
            res.status(201).json({
                message: 'Added to playlist successfully.',
                track: track,
            });
        })
        .then(() => playlistArtGenerator(playList))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Encountered an error',
                error: err
            });
        });
});

// handle DELETE requests on /playlists/:playlistName/
// delete the playlist
router.delete('/:playlistName', (req, res, next) => {
    const playlistName = req.params.playlistName;

    Playlists
        .deleteOne(
            { _id: playlistName }
        )
        .then(result => {
            res.status(200).json({
                message: 'Removed successfully.',
                systemMessage: result
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

// handle DELETE requests on /playlists/:playlistName/:trackId
// delete the track from playlist
router.delete('/:playlistName/:trackId', (req, res, next) => {
    const trackId = req.params.trackId;
    const playlistName = req.params.playlistName;

    Playlists
        .findOneAndUpdate(
            { _id: playlistName },
            { $pullAll: { tracks: [trackId] } },
            {
                new: true,
                useFindAndModify: false
            }
        )
        .then(result => {
            res.status(200).json({
                message: 'Removed successfully.',
                systemMessage: result
            });
        })
        .then(() => playlistArtGenerator(playlistName))
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Encountered an error',
                error: err
            });
        });
});

module.exports = router;