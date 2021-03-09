const mongoose = require('mongoose');
const Playlists = require('./../models/playlists');
const Tracks = require('./../models/tracks');

exports.getPlaylists = async () => {
    // store playlists tracks path to restore
    // them later
    let playlistsData = {};
    await Playlists.find()
        .populate('tracks')
        .then(pls => {
            pls.forEach(pl => {
                const name = pl._id;
                const tracks = pl.tracks.map(track => {
                    return track.path;
                });
                playlistsData[name] = tracks;
            });
        });
    console.log('debug: handlePlaylists: getPlaylists: playlistsData:', playlistsData);
    return playlistsData;
};

// data: {
//     'playlistName': ['trackPath', 'tracksPath', ...],
//     ...
// }
exports.save = async (data) => {
    // now change the entries according to the data
    await mongoose.connection.db.collection('playlists')
        .drop()
        .catch(e => console.log(e));
    await mongoose.connection.db.createCollection('playlists')
        .catch(e => console.log(e));
    let playlists = [];
    for (const pl in data) {
        let obj = {};
        obj['_id'] = pl;
        obj['tracks'] = [];

        for (const path of data[pl]) {
            await Tracks.findOne({ path: path })
                .then(track => {
                    obj['tracks'].push(String(track['_id']));
                });
        }

        playlists.push(obj);
    }

    console.log('handlePlaylists: save: playlists:', playlists);
    await Playlists.insertMany(playlists)
        .catch(err => {
            console.log(err);
            throw err;
        });
};