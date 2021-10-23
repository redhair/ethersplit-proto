import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import Header from './components/Header';

MyDecks.propTypes = {};

function MyDecks(props) {
  const history = useHistory();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    rehydrateDecks();
  }, []);

  function rehydrateDecks() {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];

    setDecks(savedDecks);
  }

  function deleteDeck(deckIdx) {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];
    let temp = savedDecks;
    temp.splice(deckIdx, 1);
    localStorage.setItem('decks', JSON.stringify([...temp]));
    rehydrateDecks();
  }

  return (
    <>
      <Header />
      <div className="m-8">
        <h1 className="font-black text-black text-4xl">My Decks</h1>
        <p className="my-4">Click any deck to edit or press delete to remove to delete</p>
        <div className="grid grid-cols-2">
          {decks.map((d, i) => {
            return (
              <div className="bg-gray-800 m-4 flex flex-col justify-between rounded-lg text-black font-bold p-8 my-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl text-white font-black mb-4">{d.deckName}</h2>
                  <h2 className="text-2xl text-white font-black mb-4">v{d.v}</h2>
                </div>
                <div>
                  <button
                    onClick={() => history.push(`/deck-builder/${d.deckId}`)}
                    className="bg-blue-500 text-gray-800 py-4 px-6 font-bold rounded-lg mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDeck(i)}
                    className="bg-red-400 text-gray-800 py-4 px-6 font-bold rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MyDecks;
