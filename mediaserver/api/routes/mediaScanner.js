const express = require('express');
const router = express.Router();
const glob = require('glob-promise');
const mongoose = require('mongoose');
const Files = require('./../models/files');

let configs = require('./../configs');

router.post('/', async (req, res, next) => {
    let pattern = '/**/*';
    let files = [];

    for (const path of configs.musicFolders) {
        await glob(path + pattern)
            .then(result => {
                result.forEach(eachPath => {
                    files.push({ path: eachPath });
                });
            })
            .catch(e => {
                res.status(500).json({
                    error: e
                });
            });
    }

    await mongoose.connection.db.dropCollection('files')
        .then(() => {
            Files.insertMany(files)
                .then(result => {
                    res.status(201).json({
                        files: files,
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

module.exports = router;