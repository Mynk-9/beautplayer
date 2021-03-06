import { createContext } from 'react';

const PlayerContext = createContext({
    playPause: 'pause',
    albumArt: '',
    albumTitle: '',
    albumArtist: '',
    currentTrack: '',
    audioSrc: '',
    audioDuration: 0,
    linkBack: '',

    setPlayPause: () => { },
    setAlbumArt: () => { },
    setAlbumTitle: () => { },
    setAlbumArtist: () => { },
    setCurrentTrack: () => { },
    setAudioSrc: () => { },
    setAudioDuration: () => { },
    setLinkBack: () => { }
});

export default PlayerContext;