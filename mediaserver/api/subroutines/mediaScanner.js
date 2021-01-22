const mongoose = require('mongoose');
const glob = require('glob-promise');

const Files = require('../models/files');
let configs = require('../configs');

module.exports = async () => {

    const pattern = '/**/*';
    let files = [];

    for (const path of configs.musicFolders) {
        await glob(path + pattern)
            .then(result => {
                result.forEach(eachPath => {
                    files.push({ path: eachPath });
                });
            })
            .catch(e => {
                throw e;
            });
    }

    await mongoose.connection.db.dropCollection('files')
        .then(() => {
            Files.insertMany(files)
                .catch(e => {
                    throw e;
                });
        })
        .catch(e => {
            throw e;
        });

    return files;
};