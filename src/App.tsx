import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AddressBar from './components/AddressBar/AddressBar';
import Browse from './components/Browse/Browse';
import Video from './components/Video/Video';
import Plugin from './components/Plugin/Plugin';
import './App.css';
import Auth from './components/Auth/Auth';
import { getGlobalState } from './globalState';
import RestAPI from './restAPI';

const globalState = getGlobalState({});
RestAPI.Authentication.autoSignin();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className = 'app'>
          <Auth />
          <div onClick={ () => { globalState.layout.isAuthOpened = !globalState.layout.isAuthOpened } }>toggle</div>
          <Route path='/explore/:viewer/:path*' render={(props) => (
            <AddressBar {...props} />
          )} />
          <Switch>
            <Route path='/explore/browse/:path*' render={(props) => (
              <Browse {...props} />
            )} />
            <Route path='/explore/video/:path*' render={(props) => (
              <Video {...props} />
            )} />
            <Route path='/explore/plugin/:path*' render={(props) => (
              <Plugin {...props} />
            )} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
