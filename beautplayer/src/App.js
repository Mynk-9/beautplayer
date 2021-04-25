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

import ThemeContext from './components/themecontext';
import PlayerContext from './components/playercontext';
import SearchContext from './components/searchcontext';

function App() {

  // navbar acrylic color state
  const [acrylicColor, setAcrylicColor] = useState('--acrylic-color');
  const [letAcrylicTints, setLetAcrylicTints] = useState(false);
  const [artContext, setArtContext] = useState(null);

  // theme context hooks {
  const [colorConfig, setColorConfig] = useState('dark');
  // }

  // player context hooks {
  const [playPause, setPlayPause] = useState('pause');
  const [albumArt, setAlbumArt] = useState();           // AlbumArt           ---|
  const [albumTitle, setAlbumTitle] = useState('');     // Awesome Album      ---| these were the original testing values uwu
  const [albumArtist, setAlbumArtist] = useState('');   // Human              ---|
  const [currentTrack, setCurrentTrack] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [audioDuration, setAudioDuration] = useState('');
  const [audioVolume, setAudioVolume] = useState(1.0);
  const [linkBack, setLinkBack] = useState('');
  const [playerQueue, setPlayerQueue] = useState([]);
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
        colorConfig, setColorConfig, acrylicColor, setAcrylicColor,
        letAcrylicTints, setLetAcrylicTints, artContext, setArtContext
      }}>
        <PlayerContext.Provider
          value={{
            playPause, albumArt, albumTitle, albumArtist, currentTrack,
            audioSrc, audioDuration, audioVolume, linkBack, playerQueue,
            setPlayPause, setAlbumArt, setAlbumTitle, setAlbumArtist,
            setCurrentTrack, setAudioSrc, setAudioDuration, setAudioVolume,
            setLinkBack, setPlayerQueue
          }}
        >
          <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
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
