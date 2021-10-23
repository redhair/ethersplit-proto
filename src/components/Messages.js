import React, { useEffect, useState, useRef } from 'react';

export default function Messages({ socket }) {
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef();

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    const messageListener = (message) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[message.id] = message;
        return newMessages;
      });
      scrollToBottom();
    };

    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[messageID];
        return newMessages;
      });
    };

    socket.on('message', messageListener);
    socket.on('deleteMessage', deleteMessageListener);
    socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
      socket.off('deleteMessage', deleteMessageListener);
    };
  }, [socket]);

  return (
    <>
      <div className="message-list h-full	overflow-y-scroll">
        {[...Object.values(messages)]
          .sort((a, b) => a.time - b.time)
          .map((message) => {
            if (!message.user) return null;
            return (
              <div
                key={message.id}
                className="message-container text-white"
                title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
              >
                <span className="pr-2 text-xs text-gray-500">{new Date(message.time).toLocaleTimeString()}</span>
                <span style={{ color: message.user.color }} className="font-bold">
                  {message.user.name}:&nbsp;
                </span>
                <span className="">{message.value}</span>
              </div>
            );
          })}
      </div>
      <div ref={messagesEndRef} />
    </>
  );
}
