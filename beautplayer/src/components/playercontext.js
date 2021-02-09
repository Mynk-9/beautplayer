import { createContext } from 'react';

const PlayerContext = createContext({
    playPause: 'pause',
    albumArt: '',
    albumTitle: '',
    albumArtist: '',
    audioSrc: '',
    audioDuration: 0,

    setPlayPause: () => { },
    setAlbumArt: () => { },
    setAlbumTitle: () => { },
    setAlbumArtist: () => { },
    setAudioSrc: () => { },
    setAudioDuration: () => { },
});

export default PlayerContext;