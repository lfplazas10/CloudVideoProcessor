import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import Contest from "./Components/Contest";
import ContestDetail from "./Components/ContestDetail";

const browserHistory = createBrowserHistory();

ReactDOM.render(<Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/contests" component={Contest}/>
      <Route exact path="/contest" component={ContestDetail}/>


    </Switch>
  </Router>, document.getElementById('root'));
registerServiceWorker();
