import { createWriteStream } from 'fs';
import { join } from 'path';
import createCollage from 'nf-photo-collage';

import Playlists from '../models/playlists.js';

const imagemin = import('imagemin');
const imageminMozjpeg = import('imagemin-mozjpeg');

function getAlbumArtFilePath(name) {
   const sanitisedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // thanks to https://stackoverflow.com/a/8485137/6262571
   return join(__dirname, `/../../public/coverArt/${sanitisedName}.jpg`);
}
function getPlaylistArtPath(name, isCompressed = false, directoryOnly = false) {
   const sanitisedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // thanks to https://stackoverflow.com/a/8485137/6262571

   if (directoryOnly) {
      if (isCompressed) {
         return join(__dirname, '/../../public/coverArt/playlists/compressed');
      }
      return join(__dirname, '/../../public/coverArt/playlists');
   }
   if (isCompressed) {
      return join(
         __dirname,
         `/../../public/coverArt/playlists/compressed/${sanitisedName}.jpg`
      );
   }
   return join(
      __dirname,
      `/../../public/coverArt/playlists/${sanitisedName}.jpg`
   );
}

export default (plName) => {
   Playlists.findById(plName)
      .populate('tracks')
      .then(async (playlist) => {
         const { tracks } = playlist;
         let options;

         // imageWidth and imageHeight properties are for individual images
         switch (tracks.length) {
            case 0:
               break;
            case 1:
               options = {
                  sources: [getAlbumArtFilePath(playlist.tracks[0].album)],
                  width: 1,
                  height: 1,
                  imageWidth: 500,
                  imageHeight: 500,
                  backgroundImage: '',
                  spacing: 0,
               };
               break;
            case 2:
               options = {
                  sources: [
                     getAlbumArtFilePath(playlist.tracks[0].album),
                     getAlbumArtFilePath(playlist.tracks[1].album),
                  ],
                  width: 2,
                  height: 1,
                  imageWidth: 500,
                  imageHeight: 500,
                  backgroundImage: '',
                  spacing: 0,
               };
               break;
            case 3:
               options = {
                  sources: [
                     getAlbumArtFilePath(playlist.tracks[0].album),
                     getAlbumArtFilePath(playlist.tracks[1].album),
                     getAlbumArtFilePath(playlist.tracks[2].album),
                  ],
                  width: 2,
                  height: 2,
                  imageWidth: 500,
                  imageHeight: 500,
                  backgroundImage: '',
                  spacing: 0,
               };
               break;
            default:
               options = {
                  sources: [
                     getAlbumArtFilePath(playlist.tracks[0].album),
                     getAlbumArtFilePath(playlist.tracks[1].album),
                     getAlbumArtFilePath(playlist.tracks[2].album),
                     getAlbumArtFilePath(playlist.tracks[3].album),
                  ],
                  width: 2,
                  height: 2,
                  imageWidth: 500,
                  imageHeight: 500,
                  backgroundImage: '',
                  spacing: 0,
               };
               break;
         }

         if (options) {
            await createCollage(options)
               .then(async (canvas) => {
                  const src = canvas.jpegStream();
                  const dest = createWriteStream(getPlaylistArtPath(plName));
                  src.pipe(dest);
                  dest.on('close', async () => {
                     // imagemin module has support problems with windows forward-slash paths
                     // https://github.com/imagemin/imagemin/issues/352
                     // hence if platform is windows, we replace backward slashes with forward
                     // https://github.com/imagemin/imagemin/issues/352#issuecomment-682215303

                     let playlistArtPath = getPlaylistArtPath(
                        plName,
                        false,
                        false
                     );
                     if (process.platform === 'win32')
                        playlistArtPath = playlistArtPath.replace(/\\/g, '/');

                     await imagemin([playlistArtPath], {
                        destination: getPlaylistArtPath('', true, true),
                        plugins: [imageminMozjpeg({ quality: 10 })],
                     });
                  });
               })
               .catch((err) => {
                  console.log(err);
               });
         }
      })
      .catch((err) => {
         console.log(err);
         throw err;
      });
};
