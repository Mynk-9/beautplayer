const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Tracks = require('./../models/tracks');
const mediaScanner = require('../subroutines/mediaScanner');
const metaDataScanner = require('../subroutines/metaDataScanner');

router.post('/', async (req, res, next) => {

    let files = [];

    // re-scan the library and refresh the files collection
    await mediaScanner()
        .then(result => files = result)
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });

    // return if headers already sent
    if (res.headersSent)
        return;

    // add meta data to the files
    await metaDataScanner(files)
        .then(result => {
            files = result
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });

    // return if headers already sent
    if (res.headersSent)
        return;

    try {
        await mongoose.connection.db.collection('albums')
            .drop()
            .catch(e => console.log(e));
        await mongoose.connection.db.createCollection('albums')
            .catch(e => console.log(e));

        Tracks
            .aggregate([
                {
                    $group: {
                        _id: '$album',
                        tracks: {
                            $push: { _id: '$_id', title: '$title' }
                        }
                    }
                },
                { $out: 'albums' }
            ], c => {
                if (c)
                    console.log(c);
            });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: e
        });
    }

    // return if headers already sent
    if (res.headersSent)
        return;

    res.status(201).json({
        files: files
    });
});

module.exports = router;