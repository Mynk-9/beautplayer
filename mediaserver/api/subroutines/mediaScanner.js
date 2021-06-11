const fs = require('fs');
const glob = require('glob-promise');

let configs = require('../configs');

module.exports = async () => {

    const pattern = '/**/*';
    let files = [];

    for (const path of configs.musicFolders) {
        await glob(path + pattern)
            .then(result => {
                result.forEach(eachPath => {
                    if (fs.lstatSync(eachPath).isFile())
                        files.push({ path: eachPath });
                });
            })
            .catch(e => {
                console.log(e);
                throw e;
            });
    }

    return files;
};