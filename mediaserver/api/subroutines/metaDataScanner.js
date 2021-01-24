const mongoose = require('mongoose');
const mm = require('music-metadata');
const { basename, extname } = require('path');

const Tracks = require('./../models/tracks');

module.exports = async (files) => {
    let finalList = [];
    for (let file of files) {
        let path = file['path'];
        await mm.parseFile(path)
            .then(metaData => {
                file['title'] = metaData.common.title;
                file['album'] = metaData.common.album;
                file['albumArtist'] = metaData.common.albumartist;
                file['contributingArtists'] = metaData.common.artists;
                file['year'] = metaData.common.year;
                file['genre'] = metaData.common.genre;
                file['label'] = metaData.common.label;
                file['trackXofY'] = metaData.common.track;
                file['diskXofY'] = metaData.common.disk;

                file['length'] = metaData.format.duration;
                file['sampleRate'] = metaData.format.sampleRate;
                file['channelCount'] = metaData.format.numberOfChannels;
                file['codec'] = metaData.format.codec;
                file['lossless'] = metaData.format.lossless;

                file['musicbrainz_trackid'] =
                    metaData.common.musicbrainz_trackid;

                if (metaData.common.title && metaData.format.duration)  // got both
                    finalList.push(file);
                else if (metaData.format.duration) {    // got length
                    file['title'] = basename(path, extname(path));
                    finalList.push(file);
                }
                else if (metaData.common.title) { // got title
                    file['length'] = -1;
                    finalList.push(file);
                }
                else
                    console.log('Filed without required metadata: ', file);
            })
            .catch(e => {
                // console.log(e);
                console.log('debug: metaDataScanner:  NOT_MUSIC_FILE: ', path);
            });
    }

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

    return finalList;
};