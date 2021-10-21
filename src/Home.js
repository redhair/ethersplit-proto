import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
const uuidv4 = require('uuid').v4;

Home.propTypes = {};

function Home(props) {
  const [deck, setDeck] = useState('');
  const history = useHistory();

  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen">
        <button
          className="px-6 py-4 bg-blue-600 text-white font-bold rounded-lg mb-4"
          onClick={async () => {
            const gameId = uuidv4();

            history.push(`/game/${gameId}`);
          }}
        >
          New Game
        </button>
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
        {/* <Board></Board> */}
        {/* <Chat /> */}
      </div>
    </div>
  );
}

export default Home;
