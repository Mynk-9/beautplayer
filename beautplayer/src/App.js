import { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/mainpage/MainPage';
import AlbumPage from './pages/albumpage/AlbumPage';
import SettingsPage from './pages/settingspage/SettingsPage';

import PlayerBar from './components/playerbar/PlayerBar';
import AlbumArt from './assets/images/pexels-steve-johnson-1234853.jpg';

import PlayerContext from './components/playercontext';

function App() {

  // player context hooks {
  const [playPause, setPlayPause] = useState('pause');
  const [albumArt, setAlbumArt] = useState(AlbumArt);
  const [albumTitle, setAlbumTitle] = useState('Awesome Album');
  const [albumArtist, setAlbumArtist] = useState('Human');
  const [audioSrc, setAudioSrc] = useState('');
  // }

  return (
    <>
      <PlayerContext.Provider
        value={{
          playPause, albumArt, albumTitle, albumArtist, audioSrc,
          setPlayPause, setAlbumArt, setAlbumTitle, setAlbumArtist, setAudioSrc
        }}
      >
        <BrowserRouter>
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
        </BrowserRouter>
        <PlayerBar />
      </PlayerContext.Provider>
    </>
  );
}

export default App;
