import React from 'react';
// import PropTypes from 'prop-types';

OpponentCardSlot.propTypes = {};

function OpponentCardSlot({ title }) {
  return <div className="px-8 py-12 rounded-lg bg-white border border-gray-400">{title ? <p>{title}</p> : 'none'}</div>;
}

export default OpponentCardSlot;
