import mongoose from 'mongoose';
const { connection } = mongoose;
import Playlists from '../models/playlists.js';
import Tracks from '../models/tracks.js';

export async function getPlaylists() {
   // store playlists tracks path to restore
   // them later
   const playlistsData = {};
   await Playlists.find()
      .populate('tracks')
      .then((pls) => {
         pls.forEach((pl) => {
            const name = pl._id;
            const tracks = pl.tracks.map((track) => track.path);
            playlistsData[name] = tracks;
         });
      });
   console.log(
      'debug: handlePlaylists: getPlaylists: playlistsData:',
      playlistsData
   );
   return playlistsData;
}

// data: {
//     'playlistName': ['trackPath', 'tracksPath', ...],
//     ...
// }
export async function save(data) {
   // now change the entries according to the data
   await connection.db
      .collection('playlists')
      .drop()
      .catch((e) => console.log(e));
   await connection.db
      .createCollection('playlists')
      .catch((e) => console.log(e));
   const playlists = [];
   for (const pl in data) {
      const obj = {};
      obj._id = pl;
      obj.tracks = [];

      for (const path of data[pl]) {
         await Tracks.findOne({ path }).then((track) => {
            obj.tracks.push(String(track._id));
         });
      }

      playlists.push(obj);
   }

   console.log('handlePlaylists: save: playlists:', playlists);
   await Playlists.insertMany(playlists).catch((err) => {
      console.log(err);
      throw err;
   });
}
