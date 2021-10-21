const uuidv4 = require('uuid').v4;

const messageExpirationTimeMS = 5 * 60 * 1000;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.messages = new Set();
    this.users = new Map();
    this.defaultUser = {
      id: 'anon',
      name: 'Anonymous',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    };

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (value) => this.handleMessage(value));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  sendMessage(message) {
    this.io.sockets.emit('message', message);
  }

  getMessages() {
    this.messages.forEach((message) => this.sendMessage(message));
  }

  handleMessage(value) {
    const message = {
      id: uuidv4(),
      user: this.users.get(this.socket) || this.defaultUser,
      value,
      time: Date.now(),
    };

    this.messages.add(message);
    this.sendMessage(message);

    setTimeout(() => {
      this.messages.delete(message);
      this.io.sockets.emit('deleteMessage', message.id);
    }, messageExpirationTimeMS);
  }

  disconnect() {
    this.users.delete(this.socket);
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
}

module.exports = chat;
