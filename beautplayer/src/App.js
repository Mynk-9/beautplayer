import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/mainpage/MainPage';
import AlbumPage from './pages/albumpage/AlbumPage';
import SettingsPage from './pages/settingspage/SettingsPage';

import PlayerBar from './components/playerbar/PlayerBar';
import AlbumArt from './assets/images/pexels-steve-johnson-1234853.jpg';

function App() {
  return (
    <>
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
      <PlayerBar
        albumArt={AlbumArt}
        AlbumTitle="Awesome Album"
        albumArtist="Human"
        audioSrc={""}
      />
    </>
  );
}

export default App;
