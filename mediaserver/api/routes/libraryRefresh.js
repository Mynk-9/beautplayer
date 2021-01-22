const express = require('express');
const router = express.Router();
const mm = require('music-metadata');

const mediaScanner = require('../subroutines/mediaScanner');

router.post('/', async (req, res, next) => {

    let files = [];

    // re-scan the library and refresh the files collection
    await mediaScanner()
        .then(filesArray => files = filesArray)
        .catch(e => {
            res.status(500).json({
                error: e
            });
        });

    res.status(201).json({
        files: files
    });
});

module.exports = router;