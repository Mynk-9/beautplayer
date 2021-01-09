import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './routes/mainpage/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact
          path="/"
          render={props => <MainPage />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
