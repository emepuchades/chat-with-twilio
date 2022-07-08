import React from "react";
import { Router, Route, Switch, useHistory, create } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import ChatScreen from "./screens/ChatScreens";
import Login from "./screens/Login";

const history = createBrowserHistory();

function RoutesApp() {

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/chat" component={ChatScreen} />
        <Route path="/" component={Login} />
        <Route render={() => <h1>Not found!</h1>} />
      </Switch>
    </Router>
  );
}

export default RoutesApp;