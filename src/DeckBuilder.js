import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Alert from './components/Alert';
import Header from './components/Header';
import config from './game/config';
import { useParams } from 'react-router-dom';
import update from 'immutability-helper';
const uuidv4 = require('uuid').v4;

DeckBuilder.propTypes = {};

function DeckBuilder(props) {
  const params = useParams();
  const [deck, setDeck] = useState([]);
  const [deckName, setDeckName] = useState('Untitled');
  const [alert, setAlert] = useState();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.deckId) {
      // load specified deck into state
      const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];

      const found = savedDecks.find((d) => d.deckId === params.deckId);
      setUpdating(true);
      setDeck(found.deck);
      setDeckName(found.deckName);
    }
  }, []);

  function saveDeck(e) {
    //save deck in cookies
    e.preventDefault();

    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];

    if (updating) {
      //update working deck
      const deckIdx = savedDecks.findIndex(function (d) {
        return d.deckId === params.deckId;
      });
      const updatedDeck = update(savedDecks[deckIdx], {
        deckName: { $set: deckName },
        deck: { $set: deck },
        v: {
          $apply: (v) => v + 1,
        },
      });

      const newDecks = update(savedDecks, {
        $splice: [[deckIdx, 1, updatedDeck]],
      });
      localStorage.setItem('decks', JSON.stringify([...newDecks]));
      // show success message if good
      setAlert({ type: 'success', msg: 'Your deck has been saved!' });
    } else {
      //check if deck name is unique
      for (let i = 0; i < savedDecks.length; i++) {
        const d = savedDecks[i];
        // if not show error
        if (d.deckName === deckName) {
          setAlert({ type: 'error', msg: 'That deck name is already in use.' });
          return;
        }
      }
      // add new deck
      localStorage.setItem(
        'decks',
        JSON.stringify([...savedDecks, { deckName: deckName, deck: deck, deckId: uuidv4(), v: 1 }])
      );
      // show success message if good
      setAlert({ type: 'success', msg: 'Your deck has been saved!' });
    }
  }

  function addToDeck(name) {
    if (deck.length === 30) return;
    setDeck([...deck, name]);
  }

  function removeFromDeck(idx) {
    let temp = deck;
    temp.splice(idx, 1);
    setDeck([...temp]);
  }

  return (
    <div className="bg-gray-800">
      <Header />
      <div className="flex flex-col mx-36">
        <h1 className="font-black text-white text-4xl my-4">Deck Builder</h1>
        <form onSubmit={saveDeck} className="mb-12 ">
          <label className="flex flex-col text-white">
            Deck Name:
            <input
              value={deckName}
              className="border-2 my-2 border-blue-500 bg-gray-200 text-black py-4 px-6 rounded-lg"
              placeholder="Enter deck name"
              onChange={(e) => setDeckName(e.target.value)}
              type="text"
            />
          </label>
          <button
            className="py-4 px-6 bg-gradient-to-t from-blue-600 to-blue-400 text-white font-bold rounded-lg"
            type="submit"
          >
            Save
          </button>
          {!!alert && <Alert alert={alert} />}
        </form>
        <div>
          <h1 className="font-black text-white text-2xl my-4">My deck ({deck.length}/30)</h1>
          <div className="flex flex-wrap">
            {deck.length > 0 ? (
              deck.map((c, i) => {
                const name = c;
                return (
                  <div
                    onClick={() => removeFromDeck(i)}
                    className="mr-4 mb-4 px-8 cursor-pointer py-12 rounded-lg bg-gray-400"
                  >
                    {name}
                  </div>
                );
              })
            ) : (
              <p className="text-white">Empty deck, click on a card below to add it</p>
            )}
          </div>
        </div>
        <h1 className="font-black text-white text-2xl my-4">Characters</h1>
        <div className="flex flex-wrap">
          {Object.keys(config.racialPassiveMap).map((r) => {
            const name = r;
            return (
              <div
                onClick={() => addToDeck(name)}
                className="mr-4 mb-4 px-8 cursor-pointer py-12 rounded-lg bg-gray-400"
              >
                {name}
              </div>
            );
          })}
        </div>

        <h1 className="font-black text-white text-2xl my-4">Melee Weapons</h1>
        <div className="flex flex-wrap">
          {Object.keys(config.weaponGradeDmgMap.MELEE).map((w) => {
            const name = w + '_SWORD';
            return (
              <div
                onClick={() => addToDeck(name)}
                className="mr-4 mb-4 px-8 cursor-pointer py-12 rounded-lg bg-gray-400"
              >
                {name}
              </div>
            );
          })}
        </div>

        <h1 className="font-black text-white text-2xl my-4">Range Weapons</h1>
        <div className="flex flex-wrap">
          {Object.keys(config.weaponGradeDmgMap.RANGE).map((w) => {
            const name = w + '_BOW';
            return (
              <div
                onClick={() => addToDeck(name)}
                className="mr-4 mb-4 px-8 cursor-pointer py-12 rounded-lg bg-gray-400"
              >
                {name}
              </div>
            );
          })}
        </div>

        <h1 className="font-black text-white text-2xl my-4">Spells</h1>
        <div className="flex flex-wrap">
          {Object.keys(config.spellEffectMap).map((s) => {
            const name = s;
            return (
              <div
                onClick={() => addToDeck(name)}
                className="mr-4 mb-4 px-8 cursor-pointer py-12 rounded-lg bg-gray-400"
              >
                {name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DeckBuilder;
