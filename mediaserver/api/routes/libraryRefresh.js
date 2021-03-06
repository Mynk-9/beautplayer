const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Files = require('../models/files');
const Tracks = require('./../models/tracks');

const mediaScanner = require('../subroutines/mediaScanner');
const metaDataScanner = require('../subroutines/metaDataScanner');
const albumArtGenerator = require('../subroutines/albumArtGenerator');

router.post('/', async (req, res, next) => {

    let files = [];

    ////////////////////////////////////////
    //////////////// STEP 1 ////////////////
    ////////////////////////////////////////

    // scan the library
    await mediaScanner()
        .then(result => files = result)
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });

    // refresh the files collection
    await mongoose.connection.db.dropCollection('files')
        .then(() => {
            Files.insertMany(files)
                .catch(e => {
                    console.log(e);
                    throw e;
                });
        })
        .catch(e => {
            console.log(e);
            throw e;
        });

    // return if headers already sent
    if (res.headersSent)
        return;

    ////////////////////////////////////////
    //////////////// STEP 2 ////////////////
    ////////////////////////////////////////

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

    // refresh the files collection
    await mongoose.connection.db.collection('tracks')
        .drop()
        .catch(e => console.log(e));
    await mongoose.connection.db.createCollection('tracks')
        .catch(e => console.log(e));
    await Tracks.insertMany(finalList)
        .catch(e => {
            console.log(e);
            throw e;
        });

    // return if headers already sent
    if (res.headersSent)
        return;

    ////////////////////////////////////////
    //////////////// STEP 3 ////////////////
    ////////////////////////////////////////

    // aggregate tracks into albums collection and add info
    try {
        await mongoose.connection.db.collection('albums')
            .drop()
            .catch(e => console.log(e));
        await mongoose.connection.db.createCollection('albums')
            .catch(e => console.log(e));

        // aggregate
        await Tracks
            .aggregate([
                {
                    $group: {
                        _id: '$album',
                        tracks: {
                            $push: '$_id'
                        },
                        albumArtist: {
                            $addToSet: "$albumArtist"
                        },
                        year: {
                            $addToSet: "$year"
                        },
                        genre: {
                            $first: "$genre"
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

    ////////////////////////////////////////
    //////////////// STEP 4 ////////////////
    ////////////////////////////////////////

    // get the album arts
    try {
        albumArtGenerator();
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