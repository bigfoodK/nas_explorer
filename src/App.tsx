import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AddressBar from './components/AddressBar/AddressBar';
import Browse from './components/Browse/Browse';
import Video from './components/Video/Video';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className = 'app'>
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
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
