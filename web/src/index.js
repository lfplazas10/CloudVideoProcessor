import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import Contest from "./Components/ManagerView/Contest";
import ContestDetail from "./Components/ManagerView/ContestDetail";
import ContestPublic from "./Components/PublicView/ContestPublic";
import authChecker from './Helpers/UserManagement.js'

const browserHistory = createBrowserHistory();
authChecker();
ReactDOM.render(
    <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/contests" component={Contest}/>
      <Route exact path="/contest/:contestId" component={ContestDetail}/>
      <Route exact path="/public/contest/:contestUrl" component={ContestPublic}/>
    </Switch>
  </Router>, document.getElementById('root'));
registerServiceWorker();
