import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/mainpage/MainPage';
import AlbumPage from './pages/albumpage/AlbumPage';
import SettingsPage from './pages/settingspage/SettingsPage';

function App() {
  return (
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
  );
}

export default App;
