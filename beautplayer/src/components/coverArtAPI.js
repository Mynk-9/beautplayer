import API from './apiLink';

// thanks to https://stackoverflow.com/a/8485137/6262571 for the regex

export function albumArt(albumName) {
    return (
        API +
        '/coverart/' +
        albumName.replace(/[^a-z0-9]/gi, '_').toLowerCase() +
        '.jpg'
    );
}
export function albumArtCompressed(albumName) {
    return (
        API +
        '/coverart/compressed/' +
        albumName.replace(/[^a-z0-9]/gi, '_').toLowerCase() +
        '.jpg'
    );
}
export function playlistArt(playlistName) {
    return (
        API +
        '/coverart/playlists/' +
        playlistName.replace(/[^a-z0-9]/gi, '_').toLowerCase() +
        '.jpg'
    );
}
export function playlistArtCompressed(playlistName) {
    return (
        API +
        '/coverart/playlists/compressed/' +
        playlistName.replace(/[^a-z0-9]/gi, '_').toLowerCase() +
        '.jpg'
    );
}
