const express = require('express');
const router = express.Router();
const glob = require('glob-promise');
const mongoose = require('mongoose');
const Files = require('./../models/files');

let configs = require('./../configs');

router.post('/', async (req, res, next) => {
    let pattern = '/**/*';
    let files = {};
    let fileListForDB = [];

    for (const path of configs.musicFolders) {
        await glob(path + pattern)
            .then(result => {
                files[path] = result;
                result.forEach(eachPath => {
                    fileListForDB.push({ path: eachPath });
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
            Files.insertMany(fileListForDB)
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