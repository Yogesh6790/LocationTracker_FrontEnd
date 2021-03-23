import './App.css';
import LocationTracker from './components/LocationTracker';

import React, { Component } from 'react';

export class App extends Component {
  render() {
    return (
      <div className="App">
          <LocationTracker />
        </div>
    );
  }
}

export default App;
