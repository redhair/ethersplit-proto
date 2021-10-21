import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';

Chat.propTypes = {};

function Chat({ socket }) {
  return (
    <>
      {socket ? (
        <div className="flex flex-col my-12">
          <Messages socket={socket} />
          <MessageInput socket={socket} />
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </>
  );
}

export default Chat;
