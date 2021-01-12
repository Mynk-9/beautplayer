import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/mainpage/MainPage';
import AlbumPage from './pages/albumpage/AlbumPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact
          path="/"
          render={props => <MainPage />}
        />
        <Route
          path="/album"
          render={props => <AlbumPage />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
