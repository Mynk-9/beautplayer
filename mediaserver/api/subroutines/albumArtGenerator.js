const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const Albums = require('./../models/albums');
const Tracks = require('./../models/tracks');

function saveFile(buffer, name, isCompressed = false) {
    name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();  // thanks to https://stackoverflow.com/a/8485137/6262571
    let buff = new Buffer.from(buffer);
    let w;
    if (isCompressed)
        w = fs.createWriteStream(path.join(__dirname, `/../../public/coverArt/compressed/${name}.jpg`));
    else
        w = fs.createWriteStream(path.join(__dirname, `/../../public/coverArt/${name}.jpg`));
    w.write(buff);
    w.close();
}

// create image files of cover arts of albums
// pick cover art from the first track of album
module.exports = () => {
    Albums.find()                                                                  // query all albums
        .then(albums => {
            albums.forEach(album => {                                               // for each albums
                const id = album.tracks[0];
                Tracks.findById(id)                                                 // for first track
                    .then(track => {
                        const filePath = track.path;
                        mm.parseFile(filePath)
                            .then(async metadata => {
                                let imageData = metadata.common.picture[0].data;    // get album art
                                saveFile(imageData, album._id);                     // save the album art

                                let compressedImageData = await imagemin.buffer(imageData, {
                                    plugins: [
                                        imageminMozjpeg({ quality: 10 })            // compress the album art
                                    ]
                                });
                                saveFile(compressedImageData, album._id, true);     // save the compressed album art
                            })
                            .catch(e => {
                                console.log('debug: albumArtGenerator: ', filePath);
                                console.log('debug: albumArtGenerator: ', e);
                            });
                    })
                    .catch(e => console.log('debug: albumArtGenerator: ', e));
            });
        })
        .catch(err => console.log('debug: albumArtGenerator: ', err));
};