import React, { useState, useEffect } from 'react';
import { Board } from '../src/components/Board';
import { OpponentBoard } from './components/OpponentBoard';
import Chat from '../src/components/Chat';
import Header from '../src/components/Header';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom';

Game.propTypes = {};

function Game(props) {
  const { gameId } = useParams();
  const [player, setPlayer] = useState();
  const [challenge, setChallenge] = useState();
  const [gameState, setGameState] = useState('challenge');
  const [boardState, setBoardState] = useState();
  const [game, setGame] = useState();
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const [savedDecks, setSavedDecks] = useState();
  const [deck, setDeck] = useState({ deckName: '' });

  function acceptChallenge() {
    console.log('in', { socket });
    socket.emit('acceptChallenge', { player: { name: 'Anonymous', deck: deck.deck } });
  }

  function setCard(index, item) {
    console.log({ id: socket.id, index, item });
    //apply update to curernt board state
    console.log({ boardState });
    let temp = boardState;
    temp[socket.id].cardSlots.splice(index, 1, item);
    console.log({ temp });
    setBoardState({ ...temp });
    socket.emit('changeBoardState', boardState);
  }

  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];

    setSavedDecks(savedDecks);
  }, []);

  useEffect(() => {
    if (challenge) return;

    const newSocket = io(`http://${window.location.hostname}:3000`, {
      query: { gameId, player: JSON.stringify(player) },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, gameId, challenge, player]);

  useEffect(() => {
    if (!socket) return;
    const msgListener = (message) => {
      console.log('msg listener', message);
      if (message === 'challenge') {
        setChallenge(true);
      }
    };
    const challengeListener = () => {
      console.log('challenge listener');
      setChallenge(false);
      setGame(true);
    };
    const boardStateListener = (boardState) => {
      console.log('board state listener', { boardState });

      setBoardState(boardState);
    };
    const gameStateListener = (msg) => {
      console.log('game state listener', { msg });
      setGameState(msg);
    };
    socket.on('message', msgListener);
    socket.on('acceptChallenge', challengeListener);
    socket.on('changeBoardState', boardStateListener);
    socket.on('changeGameState', gameStateListener);
    // socket.emit('getMessages');

    return () => {
      socket.off('message', msgListener);
      socket.off('acceptChallenge', challengeListener);
      socket.off('changeBoardState', boardStateListener);
      socket.off('changeGameState', gameStateListener);
    };
  }, [socket]);

  function renderGameState() {
    switch (gameState) {
      case 'challenge':
        return <Challenge />;
      case 'waiting':
        return <Waiting />;
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
              return <option>{d.deckName}</option>;
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

  function Waiting() {
    return (
      <div className="bg-gray-800 text-white flex flex-col justify-center items-center">
        Game: {gameId}
        <p>Waiting for opponent to accept...</p>
      </div>
    );
  }

  function Game() {
    const sockets = Object.keys(boardState);
    console.log({ sockets });
    const myBoardState = boardState[sockets.find((s) => s === socket.id)];
    console.log({ myBoardState });
    const opponentBoardState = boardState[sockets.find((s) => s !== socket.id)];
    console.log({ opponentBoardState });
    const myCardSlots = myBoardState.cardSlots;
    const opponentCardSlots = opponentBoardState.cardSlots;
    console.log({ myCardSlots, opponentCardSlots });
    return (
      <div className="bg-gray-800">
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
      {renderGameState()}
    </>
  );
}

export default Game;
