const express = require('express');
const router = express.Router();
const Albums = require('./../models/albums');

// handle GET to /albums
router.get('/', (req, res, next) => {
    Albums.find()
        .exec()
        .then(albums => {
            res.status(200).json({
                AlbumsList: albums.map(album => {
                    return {
                        albumArtist: album.albumArtist,
                        year: album.year,
                        genre: album.genre,
                        _id: album._id
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

router.get('/:albumName', (req, res, next) => {
    const id = req.params.albumName;
    Albums.findOne({_id: id})
        .populate('tracks')
        .exec()
        .then(album => {
            res.status(200).json({
                Album: album
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