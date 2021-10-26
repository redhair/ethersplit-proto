import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

Header.propTypes = {};

function Header(props) {
  return (
    <div>
      <div className="flex bg-gray-800 p-8">
        <Link className="font-bold text-white mr-8" to="/">
          Home
        </Link>
        <Link className="font-bold text-white mr-8" to="/my-decks">
          My Decks
        </Link>
        <Link className="font-bold text-white mr-8" to="/deck-builder">
          New Deck
        </Link>
      </div>
    </div>
  );
}

export default Header;
