import { createWriteStream } from 'fs';
import { join } from 'path';

import Albums from '../models/albums.js';
import Tracks from '../models/tracks.js';

// eslint-disable-next-line import/no-unresolved
const mm = import('music-metadata');
const imagemin = import('imagemin');
const imageminMozjpeg = import('imagemin-mozjpeg');

function saveFile(buffer, name, isCompressed = false) {
   const sanitisedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // thanks to https://stackoverflow.com/a/8485137/6262571
   const buff = Buffer.from(buffer);
   let w;
   if (isCompressed) {
      w = createWriteStream(
         join(
            __dirname,
            `/../../public/coverArt/compressed/${sanitisedName}.jpg`
         )
      );
   } else {
      w = createWriteStream(
         join(__dirname, `/../../public/coverArt/${sanitisedName}.jpg`)
      );
   }
   w.write(buff);
   w.close();
}

// create image files of cover arts of albums
// pick cover art from the first track of album
export default () => {
   Albums.find() // query all albums
      .then((albums) => {
         albums.forEach((album) => {
            // for each albums
            const id = album.tracks[0];
            Tracks.findById(id) // for first track
               .then((track) => {
                  const filePath = track.path;
                  mm.parseFile(filePath)
                     .then(async (metadata) => {
                        const imageData = metadata.common.picture[0].data; // get album art
                        // eslint-disable-next-line no-underscore-dangle
                        saveFile(imageData, album._id); // save the album art

                        const compressedImageData = await imagemin.buffer(
                           imageData,
                           {
                              plugins: [
                                 imageminMozjpeg({ quality: 10 }), // compress the album art
                              ],
                           }
                        );
                        // eslint-disable-next-line no-underscore-dangle
                        saveFile(compressedImageData, album._id, true); // save the compressed album art
                     })
                     .catch((e) => {
                        console.log('debug: albumArtGenerator: ', filePath);
                        console.log('debug: albumArtGenerator: ', e);
                     });
               })
               .catch((e) => console.log('debug: albumArtGenerator: ', e));
         });
      })
      .catch((err) => console.log('debug: albumArtGenerator: ', err));
};
