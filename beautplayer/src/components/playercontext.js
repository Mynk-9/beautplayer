import { createContext } from 'react';

const PlayerContext = createContext({
    playPause: 'pause',
    setPlayPause: () => { },

    albumArt: '',
    setAlbumArt: () => { },

    albumTitle: '',
    setAlbumTitle: () => { },

    albumArtist: '',
    setAlbumArtist: () => { },

    currentTrack: '',
    setCurrentTrack: () => { },

    audioSrc: '',
    setAudioSrc: () => { },

    audioDuration: 0,
    setAudioDuration: () => { },

    audioVolume: 1.0,
    setAudioVolume: () => { },

    linkBack: '',
    setLinkBack: () => { },

    playPauseFadeEnable: true,
    setPlayPauseFadeEnable: () => { },

    crossfadeEnable: true,
    setCrossfadeEnable: () => { },
    crossfadePlaylist: true,
    setCrossfadePlaylist: () => { },
    crossfadeNextPrev: false,
    setCrossfadeNextPrev: () => { },
    crossfadeDuration: 1,
    setCrossfadeDuration: () => { },
});

export default PlayerContext;