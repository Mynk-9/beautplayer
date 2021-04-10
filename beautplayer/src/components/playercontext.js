import { createContext } from 'react';

const PlayerContext = createContext({
    playPause: 'pause',
    albumArt: '',
    albumTitle: '',
    albumArtist: '',
    currentTrack: '',
    audioSrc: '',
    audioDuration: 0,
    audioVolume: 1.0,
    linkBack: '',

    playerQueue: [],
    /*
        see components/tracklist/TrackList.js for more info
        [
            {
                'trackId': ...,
                'audioSrc': ...,
                'audioDuration': ...,
                'track': ...,
                'albumArt': ...,
                'albumTitle': ...,
                'albumArtist': ...,
                'isPlaylist': ...,
                'playlistTitle': ...,
                'linkBack': ...
            }, 
            ...
        ]
    */

    setPlayPause: () => { },
    setAlbumArt: () => { },
    setAlbumTitle: () => { },
    setAlbumArtist: () => { },
    setCurrentTrack: () => { },
    setAudioSrc: () => { },
    setAudioDuration: () => { },
    setAudioVolume: () => { },
    setLinkBack: () => { },

    setPlayerQueue: () => { },
});

export default PlayerContext;