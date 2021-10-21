import React, { useState } from 'react';

const MessageInput = ({ socket }) => {
  const [value, setValue] = useState('');
  const submitForm = (e) => {
    e.preventDefault();
    socket.emit('message', value);
    setValue('');
  };

  return (
    <form className="border-2 rounded-lg border-gray-500 py-4 px-6 mt-4" onSubmit={submitForm}>
      <input
        className="w-full outline-none"
        autoFocus
        value={value}
        placeholder="Type your message"
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </form>
  );
};

export default MessageInput;
