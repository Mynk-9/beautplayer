let API = window.location.origin;
API = API.substring(0, API.lastIndexOf(':'));
API += ':5000';

// thanks to https://stackoverflow.com/a/8485137/6262571 for the regex

export function albumArt(albumName) {
    return API + '/coverart/' + albumName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
}
export function albumArtCompressed(albumName) {
    return API + '/coverart/compressed/' + albumName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
}