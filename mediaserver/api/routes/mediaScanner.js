const express = require('express');
const router = express.Router();
const fs = require('fs');
const glob = require('glob-promise');

let configs = require('./../configs');

router.post('/', async (req, res, next) => {
    let pattern = '/**/*';
    let files = {};

    for (const path of configs.musicFolders) {
        await glob(path + pattern).then(result => {
            files[path] = result;
        });
    }

    res.status(201).json({
        files: files,
    });
});

module.exports = router;