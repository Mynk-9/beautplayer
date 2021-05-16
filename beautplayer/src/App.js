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
  const [audioVolume, _setAudioVolume] = useState(1.0);
  const [linkBack, setLinkBack] = useState('');

  const setPlayPause = (newState) => {
    if (newState === 'play')
      playerManager.play();
    else
      playerManager.pause();
    _setPlayPause(newState);
  };
  const setAudioVolume = (newState) => {
    if (newState > 1.0)
      newState = 1.0;
    else if (newState < 0.0)
      newState = 0.0;
    newState = parseFloat(newState).toFixed(2);
    playerManager.setVolume(newState);
    _setAudioVolume(newState);
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
    const av = parseFloat(localStorage.getItem('config-audioVolume')) || 1.0;

    if (cc === 'light')
      document.body.classList.add('light-mode');
    else
      document.body.classList.remove('light-mode');

    setLetAcrylicTints(lat);
    setColorConfig(cc);
    setAudioVolume(av);
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
