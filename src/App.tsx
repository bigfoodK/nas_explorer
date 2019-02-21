import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Browse from './components/Browse/Browse';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/explore/browse/:path*' render={(props) => (
            <Browse {...props} />
          )} />
          <Route path='/explore/video' component={ Browse } />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
