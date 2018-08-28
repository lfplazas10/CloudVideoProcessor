import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Contest from "./Components/Contest";
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

const browserHistory = createBrowserHistory();

ReactDOM.render(<Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/contests" component={Contest}/>
    </Switch>
  </Router>, document.getElementById('root'));
registerServiceWorker();
