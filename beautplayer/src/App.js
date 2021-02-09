import { React, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/mainpage/MainPage';
import AlbumPage from './pages/albumpage/AlbumPage';
import SettingsPage from './pages/settingspage/SettingsPage';

import Navbar from './components/navbar/Navbar';
import PlayerBar from './components/playerbar/PlayerBar';
import AlbumArt from './assets/images/pexels-steve-johnson-1234853.jpg';

import ThemeContext from './components/themecontext';
import PlayerContext from './components/playercontext';

function App() {

  // navbar acrylic color state
  const [acrylicColor, setAcrylicColor] = useState('--acrylic-color');

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
  // }

  return (
    <>
      <ThemeContext.Provider value={{ colorConfig, setColorConfig }}>
        <PlayerContext.Provider
          value={{
            playPause, albumArt, albumTitle, albumArtist, currentTrack, audioSrc, audioDuration,
            setPlayPause, setAlbumArt, setAlbumTitle, setAlbumArtist, setCurrentTrack, setAudioSrc, setAudioDuration
          }}
        >
          <BrowserRouter>
            <Navbar
              acrylicColor={acrylicColor}
            />
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
                path="/settings"
                render={props => <SettingsPage />}
              />
            </Switch>
            <PlayerBar />
          </BrowserRouter>
        </PlayerContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
