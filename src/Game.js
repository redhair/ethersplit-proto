import React, { useState, useEffect } from 'react';
import { Board } from '../src/components/Board';
import { OpponentBoard } from './components/OpponentBoard';
import Chat from '../src/components/Chat';
import Header from '../src/components/Header';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useHistory, useParams } from 'react-router-dom';

Game.propTypes = {};

function Game(props) {
  const { gameId } = useParams();
  const [challenge, setChallenge] = useState();
  const [boardState, setBoardState] = useState();
  const [game, setGame] = useState();
  const [socket, setSocket] = useState(null);
  const [deck, setDeck] = useState('');

  function acceptChallenge() {
    socket.emit('message', 'accept_challenge');
  }

  function setCard() {
    socket.emit('message', { value: 'changeBoardState', boardState });
  }

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`, { query: { gameId } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, gameId]);

  useEffect(() => {
    if (!socket) return;
    const messageListener = (message) => {
      console.log({ message });
      if (message === 'challenge') {
        setChallenge(true);
      }

      if (message.value === 'accept_challenge') {
        setChallenge(false);
        setGame(true);
      }

      if (message.value === 'changeBoardState') {
        setBoardState(message.boardState);
      }
    };

    socket.on('message', messageListener);
    // socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
    };
  }, [socket]);

  return (
    <>
      <Header />
      <div className="bg-gray-800">
        {challenge ? (
          <>
            <p>You've been challenged!</p>
            <p>Select your deck</p>
            <select
              onChange={(e) => {
                setDeck(e.target.value);
              }}
              value={deck}
              className="px-4 py-4 bg-white border-gray-500 border text-gray-500 outline-none font-bold rounded-lg"
            >
              <option disabled value="">
                Please select a deck
              </option>
              <option>Giant Rush</option>
              <option>Halfling Swarm</option>
              <option>Casters</option>
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
              <button className="px-6 py-4 bg-blue-500 font-bold text-white m-2 rounded-lg">Spectate</button>
            </div>
          </>
        ) : game ? (
          <>
            <OpponentBoard gameState={boardState}></OpponentBoard>
            <hr />
            <Board gameState={boardState}></Board>
            <Chat socket={socket} />
          </>
        ) : (
          <div>
            Game: {gameId}
            <p>Waiting for opponent to accept...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Game;
