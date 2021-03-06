const fs = require('fs');
const path = require('path');
const createCollage = require('nf-photo-collage');

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const Playlists = require('../models/playlists');

function getAlbumArtFilePath(name) {
    name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();  // thanks to https://stackoverflow.com/a/8485137/6262571
    return path.join(__dirname, `/../../public/coverArt/${name}.jpg`);
}
function getPlaylistArtPath(name, isCompressed = false, directoryOnly = false) {
    name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();  // thanks to https://stackoverflow.com/a/8485137/6262571

    if (directoryOnly)
        if (isCompressed)
            return (path.join(__dirname, `/../../public/coverArt/playlists/compressed`));
        else
            return (path.join(__dirname, `/../../public/coverArt/playlists`));
    else
        if (isCompressed)
            return (path.join(__dirname, `/../../public/coverArt/playlists/compressed/${name}.jpg`));
        else
            return (path.join(__dirname, `/../../public/coverArt/playlists/${name}.jpg`));
}

module.exports = (plName) => {
    Playlists.findById(plName)
        .populate('tracks')
        .then(async playlist => {
            const tracks = playlist.tracks;
            let options;

            switch (tracks.length) {
                case 0:
                    break;
                case 1:
                    options = {
                        sources: [
                            getAlbumArtFilePath(playlist.tracks[0].album)
                        ],
                        width: 1,
                        height: 1,
                        imageWidth: 1000,
                        imageHeight: 1000,
                        backgroundImage: '',
                        spacing: 0
                    };
                    break;
                case 2:
                    options = {
                        sources: [
                            getAlbumArtFilePath(playlist.tracks[0].album),
                            getAlbumArtFilePath(playlist.tracks[1].album)
                        ],
                        width: 2,
                        height: 1,
                        imageWidth: 500,
                        imageHeight: 1000,
                        backgroundImage: '',
                        spacing: 0
                    };
                    break;
                case 3:
                    options = {
                        sources: [
                            getAlbumArtFilePath(playlist.tracks[0].album),
                            getAlbumArtFilePath(playlist.tracks[1].album),
                            getAlbumArtFilePath(playlist.tracks[2].album)
                        ],
                        width: 2,
                        height: 2,
                        imageWidth: 500,
                        imageHeight: 500,
                        backgroundImage: '',
                        spacing: 0
                    };
                    break;
                default:
                    options = {
                        sources: [
                            getAlbumArtFilePath(playlist.tracks[0].album),
                            getAlbumArtFilePath(playlist.tracks[1].album),
                            getAlbumArtFilePath(playlist.tracks[2].album),
                            getAlbumArtFilePath(playlist.tracks[3].album)
                        ],
                        width: 2,
                        height: 2,
                        imageWidth: 500,
                        imageHeight: 500,
                        backgroundImage: '',
                        spacing: 0
                    };
                    break;
            }

            if (options)
                await createCollage(options)
                    .then(async canvas => {
                        const src = canvas.jpegStream();
                        const dest = fs.createWriteStream(getPlaylistArtPath(plName));
                        src.pipe(dest);
                        dest.on('close', async () => {
                            // imagemin module has support problems with windows forward-slash paths
                            // https://github.com/imagemin/imagemin/issues/352
                            // hence if platform is windows, we replace backward slashes with forward
                            // https://github.com/imagemin/imagemin/issues/352#issuecomment-682215303

                            let playlistArtPath = getPlaylistArtPath(plName, false, false);
                            if (process.platform == 'win32')
                                playlistArtPath = playlistArtPath.replace(/\\/g, '/');

                            await imagemin([playlistArtPath], {
                                destination: getPlaylistArtPath("", true, true),
                                plugins: [
                                    imageminMozjpeg({ quality: 10 })
                                ]
                            });
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};
