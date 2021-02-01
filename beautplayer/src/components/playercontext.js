import { createContext } from 'react';

const PlayerContext = createContext({
    playPause: 'pause',
    albumArt: '',
    albumTitle: '',
    albumArtist: '',
    audioSrc: '',

    setPlayPause: () => { },
    setAlbumArt: () => { },
    setAlbumTitle: () => { },
    setAlbumArtist: () => { },
    setAudioSrc: () => { },
});

export default PlayerContext;