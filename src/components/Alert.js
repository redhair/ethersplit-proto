import React from 'react';
import PropTypes from 'prop-types';

Alert.propTypes = {};

function Alert({ alert }) {
  const type = alert.type;
  const msg = alert.msg;

  if (type === 'error') {
    return <div className="py-4 px-8 my-4 bg-red-400 rounded-lg">{msg}</div>;
  } else if (type === 'success') {
    return <div className="py-4 px-8 my-4 bg-green-400 rounded-lg">{msg}</div>;
  }
}

export default Alert;
