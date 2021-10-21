import axios from 'axios';
import react, { useState } from 'react';
import { Board } from './components/Board';
import Chat from './components/Chat';
import logo from './logo.svg';
import Home from './Home';
import Game from './Game';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game/:gameId">
          <Game />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
