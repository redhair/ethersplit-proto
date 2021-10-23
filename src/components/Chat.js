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
        <div className="flex flex-col h-full pb-28">
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
