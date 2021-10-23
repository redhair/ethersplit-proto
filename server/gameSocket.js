import { Game } from './ethersplit/game';
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

function gameSocket(io) {
  const players = [];
  let game = null;

  io.on('connection', (socket) => {
    // console.log(socket.id);
    if (!socket.handshake.query.gameId) {
      // join homeroom chat and return
      new Connection(io, socket);
      return;
    }

    socket.join(socket.handshake.query.gameId);
    game = new Game(io, socket, socket.handshake.query.gameId);
  });

  function acceptChallenge() {
    // initialize and start the game between the two players
    game.addPlayer(players[0]);
    game.addPlayer(players[1]);
    game.start();
  }

  io.on('message', (value) => {
    switch (value) {
      case 'accept_challenge':
        acceptChallenge();
        break;
      default:
        break;
    }
  });

  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
    const index = players.indexOf(id);
    if (index > -1) {
      players.splice(index, 1);
    }
  });

  io.of('/').adapter.on('join-room', (room, id) => {
    // ignore default rooms
    if (room === id) {
      return;
    }
    console.log('player:', id, ' joined ', room);
    if (players.length > 0) {
      console.log('debug 1');
      players.push(id);
      io.to(id).emit('message', 'challenge');
    } else {
      console.log('debug 2');
      players.push(id);
    }
    console.log({ players });
  });
}

module.exports = gameSocket;
