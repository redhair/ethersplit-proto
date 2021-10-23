import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import { useHistory, Link } from 'react-router-dom';
import Chat from './components/Chat';
import io from 'socket.io-client';
const uuidv4 = require('uuid').v4;

Home.propTypes = {};

function Home(props) {
  const [deck, setDeck] = useState('');
  const [decks, setDecks] = useState([]);
  const history = useHistory();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    rehydrateDecks();
  }, []);

  function rehydrateDecks() {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];

    setDecks(savedDecks);
  }

  return (
    <div>
      <Header />
      <div className="grid grid-cols-3 gap-16 bg-gray-800">
        <div className="col-span-1 ml-16 bg-gray-800 grid grid-rows-3 gap-4 justify-center items-center">
          <div>
            <div className="text-white border-2 border-color-white rounded-lg p-4">
              <h2 className="text-white font-black text-2xl">News</h2>
              <ul className="list-disc list-inside	">
                <li>Deck builder is done and working</li>
                <li>Next step will be to get the game playable</li>
                <li>Chat is buggy but I will get that working soon</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-white flex flex-col font-bold">
              Deck:
              <select
                onChange={(e) => {
                  setDeck(e.target.value);
                }}
                value={deck}
                className="px-4 py-4 mb-4 bg-white border-gray-500 border text-gray-500 outline-none font-bold rounded-lg"
              >
                <option disabled value="">
                  Please select a deck
                </option>
                {decks.map((d) => {
                  return <option>{d.deckName}</option>;
                })}
              </select>
            </label>
            <button
              className="px-6 py-4 bg-gradient-to-t from-blue-600 to-blue-400 text-xl text-white font-bold rounded-lg mb-4 "
              onClick={async () => {
                const gameId = uuidv4();

                history.push(`/game/${gameId}`);
              }}
            >
              Create Game
            </button>
            <button
              className="px-6 py-4 bg-gradient-to-t from-purple-600 to-purple-400 text-xl text-white font-bold rounded-lg mb-4"
              onClick={async () => {
                const gameId = uuidv4();

                history.push(`/deck-builder`);
              }}
            >
              Deck Builder
            </button>
            <button
              className="px-6 py-4 bg-gradient-to-t from-pink-600 to-pink-400 text-xl text-white font-bold rounded-lg mb-4"
              onClick={async () => {
                history.push(`/my-decks`);
              }}
            >
              My Decks
            </button>
          </div>
        </div>
        <div className="bg-gray-800 col-span-2 mr-16 max-h-screen h-screen">
          <Chat socket={socket} />
        </div>
      </div>
    </div>
  );
}

export default Home;
