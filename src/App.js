// import axios from 'axios';
// import react, { useState } from 'react';
// import { Board } from './components/Board';
// import Chat from './components/Chat';
// import logo from './logo.svg';
import Home from './Home';
import Game from './Game';
import DeckBuilder from './DeckBuilder';
import MyDecks from './MyDecks';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/deck-builder/:deckId">
          <DeckBuilder />
        </Route>
        <Route path="/deck-builder">
          <DeckBuilder />
        </Route>
        <Route path="/my-decks">
          <MyDecks />
        </Route>
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
