import { React, useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/mainpage/MainPage';
import AlbumPage from './pages/albumpage/AlbumPage';
import PlaylistPage from './pages/playlistpage/PlaylistPage';
import SettingsPage from './pages/settingspage/SettingsPage';
import PlayerQueue from './pages/playerqueue/PlayerQueue';
import SearchPage from './pages/searchpage/SearchPage';

import Navbar from './components/navbar/Navbar';
import PlayerBar from './components/playerbar/PlayerBar';

import PlayerManager from './components/playermanager';

import ThemeContext from './components/themecontext';
import PlayerContext from './components/playercontext';
import SearchContext from './components/searchcontext';

function App() {

  let playerManager = PlayerManager.getInstance();

  // navbar acrylic color state
  const [acrylicColor, setAcrylicColor] = useState('--acrylic-color');
  const [letAcrylicTints, setLetAcrylicTints] = useState(false);
  const [artContext, setArtContext] = useState(null);

  // theme context hooks {
  const [colorConfig, setColorConfig] = useState('dark');
  // }

  // player context hooks {
  const [playPause, _setPlayPause] = useState('pause');
  const [albumArt, setAlbumArt] = useState();           // AlbumArt           ---|
  const [albumTitle, setAlbumTitle] = useState('');     // Awesome Album      ---| these were the original testing values uwu
  const [albumArtist, setAlbumArtist] = useState('');   // Human              ---|
  const [currentTrack, setCurrentTrack] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [audioDuration, setAudioDuration] = useState('');
  const [audioVolume, setAudioVolume] = useState(1.0);
  const [linkBack, setLinkBack] = useState('');
  const [playPauseFadeEnable, _setPlayPauseFadeEnable] = useState(true);
  const [crossfadeEnable, _setCrossfadeEnable] = useState(true);
  const [crossfadePlaylist, _setCrossfadePlaylist] = useState(true);
  const [crossfadeNextPrev, _setCrossfadeNextPrev] = useState(false);
  const [crossfadeDuration, _setCrossfadeDuration] = useState(1);

  const setPlayPause = (newState) => {
    if (newState === 'play')
      playerManager.play();
    else
      playerManager.pause();
    _setPlayPause(newState);
  };
  const setPlayPauseFadeEnable = (newState) => {
    let state = (newState === true);
    playerManager.setPlayPauseFade(state);
    localStorage.setItem('config-fade-playpause', state);
    _setPlayPauseFadeEnable(state);
  };
  const setCrossfadeEnable = (newState) => {
    let state = (newState === true);
    playerManager.setCrossfade({ _crossfade: state });
    localStorage.setItem('config-crossfade', state);
    _setCrossfadeEnable(state);
  };
  const setCrossfadePlaylist = (newState) => {
    let state = (newState === true);
    playerManager.setCrossfade({ _crossfadePlaylist: state });
    localStorage.setItem('config-crossfade-playlists', state);
    _setCrossfadePlaylist(state);
  };
  const setCrossfadeNextPrev = (newState) => {
    let state = (newState === true);
    playerManager.setCrossfade({ _crossfadeNextPrev: state });
    localStorage.setItem('config-crossfade-nextPrev', state);
    _setCrossfadeNextPrev(state);
  };
  const setCrossfadeDuration = (newState) => {
    let state = parseInt(newState);
    if (isNaN(state))
      state = 1;
    playerManager.setCrossfade({ _crossfadeDuration: state });
    localStorage.setItem('config-crossfade-duration', state);
    _setCrossfadeDuration(state);
  };
  // }

  // search context hooks {
  const [searchTerm, setSearchTerm] = useState('');
  // }

  /////////////////////////////////////////////////////////////////////////////
  // configurations load {

  // load the configurations as the app loads
  useEffect(() => {
    const lat = (localStorage.getItem('config-letAcrylicTints') === 'true');
    const cc = localStorage.getItem('config-colorConfig');
    let av = parseFloat(parseFloat(localStorage.getItem('config-audioVolume')).toFixed(2));
    const cf = (localStorage.getItem('config-crossfade') === 'true');
    const cfP = (localStorage.getItem('config-crossfade-playlists') === 'true');
    const cfNp = (localStorage.getItem('config-crossfade-nextPrev') === 'true');
    const ppF = (localStorage.getItem('config-fade-playpause') === 'true');
    let cfD = parseInt(localStorage.getItem('config-crossfade-duration'));
    const pmV = (localStorage.getItem('config-playermanager-verbose') === 'true');

    if (cc === 'light')
      document.body.classList.add('light-mode');
    else
      document.body.classList.remove('light-mode');

    if (isNaN(av))
      av = 1.0;
    else if (av > 1.0)
      av = 1.0;
    else if (av < 0.0)
      av = 0.0;

    if (isNaN(cfD))
      cfD = 5;

    setLetAcrylicTints(lat);
    setColorConfig(cc);
    playerManager.setVolume(av);
    setAudioVolume(av);
    setCrossfadeEnable(cf);
    setCrossfadePlaylist(cfP);
    setCrossfadeNextPrev(cfNp);
    setCrossfadeDuration(cfD);
    setPlayPauseFadeEnable(ppF);
    playerManager.setVerbose(pmV);
  }, []);

  // save audioVolume
  useEffect(() => {
    localStorage.setItem('config-audioVolume', String(audioVolume));
  }, [audioVolume]);

  // save letAcrylicTints
  useEffect(() => {
    localStorage.setItem('config-letAcrylicTints', letAcrylicTints);
  }, [letAcrylicTints]);

  // save colorConfig
  useEffect(() => {
    localStorage.setItem('config-colorConfig', colorConfig);
  }, [colorConfig]);

  // }
  /////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <ThemeContext.Provider value={{
        colorConfig: colorConfig, setColorConfig: setColorConfig,
        acrylicColor: acrylicColor, setAcrylicColor: setAcrylicColor,
        letAcrylicTints: letAcrylicTints, setLetAcrylicTints: setLetAcrylicTints,
        artContext: artContext, setArtContext: setArtContext
      }}>
        <PlayerContext.Provider
          value={{
            playPause: playPause, setPlayPause: setPlayPause,
            albumArt: albumArt, setAlbumArt: setAlbumArt,
            albumTitle: albumTitle, setAlbumTitle: setAlbumTitle,
            albumArtist: albumArtist, setAlbumArtist: setAlbumArtist,
            currentTrack: currentTrack, setCurrentTrack: setCurrentTrack,
            audioSrc: audioSrc, setAudioSrc: setAudioSrc,
            audioDuration: audioDuration, setAudioDuration: setAudioDuration,
            audioVolume: audioVolume, setAudioVolume: setAudioVolume,
            linkBack: linkBack, setLinkBack: setLinkBack,
            crossfadeEnable: crossfadeEnable, setCrossfadeEnable: setCrossfadeEnable,
            crossfadePlaylist: crossfadePlaylist, setCrossfadePlaylist: setCrossfadePlaylist,
            crossfadeNextPrev: crossfadeNextPrev, setCrossfadeNextPrev: setCrossfadeNextPrev,
            crossfadeDuration: crossfadeDuration, setCrossfadeDuration: setCrossfadeDuration,
            playPauseFadeEnable: playPauseFadeEnable, setPlayPauseFadeEnable: setPlayPauseFadeEnable,
          }}
        >
          <SearchContext.Provider
            value={{ searchTerm: searchTerm, setSearchTerm: setSearchTerm }}
          >
            <BrowserRouter>
              <Navbar />
              <Switch>
                <Route exact
                  path="/"
                  render={props => <MainPage />}
                />
                <Route
                  path="/album/:albumName"
                  render={props => <AlbumPage {...props} />}
                />
                <Route
                  path="/playlist/:playlistName"
                  render={props => <PlaylistPage {...props} />}
                />
                <Route
                  path="/settings"
                  render={props => <SettingsPage />}
                />
                <Route
                  path="/queue"
                  render={props => <PlayerQueue />}
                />
                <Route
                  path="/search"
                  render={props => <SearchPage />}
                />
              </Switch>
              <PlayerBar />
            </BrowserRouter>
          </SearchContext.Provider>
        </PlayerContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
