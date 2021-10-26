import React, { useState, useEffect } from 'react';
import { Board } from '../src/components/Board';
import { OpponentBoard } from './components/OpponentBoard';
// import Chat from '../src/components/Chat';
import Header from '../src/components/Header';
// import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom';

Game.propTypes = {};

function Game(props) {
  const { gameId } = useParams();
  const [player, setPlayer] = useState();
  const [matchState, setMatchState] = useState('challenge');
  const [gameState, setGameState] = useState();
  const [boardState, setBoardState] = useState();
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const [savedDecks, setSavedDecks] = useState();
  const [deck, setDeck] = useState({ deckName: '' });

  function acceptChallenge() {
    console.log('in', { socket });
    socket.emit('changeGameState', {
      action: 'ACCEPT_CHALLENGE',
      value: { player: { name: 'Anonymous', deck: deck.deck, socketId: socket.id } },
    });
  }

  function setCard(index, item) {
    console.log({ id: socket.id, index, item });
    //apply update to curernt board state
    console.log({ boardState });
    let temp = boardState;
    console.log({ temp });
    temp[socket.id].cardSlots.splice(index, 1, item);
    setBoardState({ ...temp });
    socket.emit('changeBoardState', { boardState, socketId: socket.id });
  }

  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];

    setSavedDecks(savedDecks);
  }, []);

  useEffect(() => {
    console.log({ matchState });
    // if (matchState === 'challenge') return;

    const newSocket = io(`http://${window.location.hostname}:3000`, {
      query: { gameId },
    });
    console.log('SETTING SOCKET: ', newSocket);
    newSocket.on('connect', (socket) => {
      console.log('connected:', socket);
      setSocket(newSocket);
    });
    return () => newSocket.close();
  }, [setSocket, gameId, matchState, player]);

  useEffect(() => {
    if (!socket) return;
    console.log('Init Browser Handlers for: ', socket.id);
    const msgListener = (message) => {
      console.log('msg listener', message);
    };
    const matchStateListener = (msg) => {
      console.log('match state listener', { msg });
      setMatchState(msg);
    };
    const gameStateListener = ({ action, value }) => {
      console.log('game state listener', { action, value });
      setGameState({ action, value });
    };
    const boardStateListener = ({ boardState }) => {
      console.log('board state listener', { boardState });
      setBoardState(boardState);
    };
    const boardErrorListener = (err) => {
      console.log('board error listener', { err });
      console.error({ err });
    };
    const connectListener = (socket) => {
      console.log('connect listener: ', socket.id);
    };
    socket.on('connection', connectListener);
    socket.on('message', msgListener);
    socket.on('changeBoardState', boardStateListener);
    socket.on('changeMatchState', matchStateListener);
    socket.on('changeGameState', gameStateListener);
    socket.on('boardError', boardErrorListener);
    // socket.emit('getMessages');

    return () => {
      socket.off('message', msgListener);
      socket.off('changeBoardState', boardStateListener);
      socket.off('changeMatchState', matchStateListener);
      socket.off('changeGameState', gameStateListener);
      socket.off('boardError', boardErrorListener);
    };
  }, [socket]);

  function renderMatchState() {
    switch (matchState) {
      case 'challenge':
        return <Challenge />;
      case 'playing':
        return <Game />;
      default:
        return null;
    }
  }

  function Challenge() {
    return (
      <div className="bg-gray-800 h-screen flex flex-col justify-center items-center">
        <p className="text-white">Select your deck</p>
        <select
          onChange={(e) => {
            console.log({ savedDecks });

            let found = savedDecks.find((d) => d.deckName === e.target.value);
            console.log({ found });
            setDeck(found);
          }}
          value={deck.deckName}
          className="px-4 py-4 bg-white border-gray-500 border text-gray-500 outline-none font-bold rounded-lg"
        >
          <option disabled value="">
            Please select a deck
          </option>
          {!!savedDecks &&
            savedDecks.map((d) => {
              return <option key={d.deckId}>{d.deckName}</option>;
            })}
        </select>
        <div className="flex ">
          <button
            onClick={() => {
              acceptChallenge();
            }}
            className="px-6 py-4 bg-blue-500 font-bold text-white m-2 rounded-lg"
          >
            Accept
          </button>
          {/* <button className="px-6 py-4 bg-blue-500 font-bold text-white m-2 rounded-lg">Spectate</button> */}
        </div>
      </div>
    );
  }

  function Game() {
    const sockets = Object.keys(boardState);
    console.log({ sockets });
    console.log({ boardState });
    console.log('My Socket ID: ', socket);
    const myBoardState = boardState[sockets.find((s) => s === socket.id)];
    console.log({ myBoardState });
    const opponentBoardState = boardState[sockets.find((s) => s !== socket.id)];
    console.log({ opponentBoardState });
    const myCardSlots = myBoardState.cardSlots;
    const opponentCardSlots = opponentBoardState.cardSlots;
    console.log({ myCardSlots, opponentCardSlots });
    return (
      <div className="bg-gray-800">
        <p>{socket.id}</p>
        <OpponentBoard cardState={opponentCardSlots}></OpponentBoard>
        <hr />
        <Board onSetCard={setCard} cardState={myCardSlots}></Board>
        {/* <Chat socket={socket} /> */}
      </div>
    );
  }

  return (
    <>
      <Header />
      {renderMatchState()}
    </>
  );
}

export default Game;
