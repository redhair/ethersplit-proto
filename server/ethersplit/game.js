const uuidv4 = require('uuid').v4;

const messageExpirationTimeMS = 5 * 60 * 1000;

export class Game {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.turn = 1;
    this.game = true;
    this.players = [];
    this.id = uuidv4();
    this.activePlayer = null;
    this.getTurn = this.getTurn.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    this.setActivePlayer = this.setActivePlayer.bind(this);
    this.getActivePlayer = this.getActivePlayer.bind(this);
    this.setGameOver = this.setGameOver.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.getId = this.getId.bind(this);

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

  getId() {
    return this.id;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  async start() {
    if (this.players.length < 2) return;

    //shuffle decks at start
    this.players.forEach((p) => {
      p.shuffleDeck();
    });

    //each player draws 6 cards at start
    this.players.forEach((p) => {
      p.drawCard();
      p.drawCard();
      p.drawCard();
      p.drawCard();
      p.drawCard();
      p.drawCard();
    });

    //determines who goes first
    this.setActivePlayer(this.players[0]);

    // official start to the game
    while (this.game) {
      await this.activePlayer.drawCard();
      await this.activePlayer.playCard();
      await this.activePlayer.attack();
    }
  }

  setGameOver() {
    this.game = false;
  }

  getActivePlayer() {
    return this.activePlayer;
  }

  setActivePlayer(player) {
    this.activePlayer = player;
  }

  nextTurn() {
    this.turn++;
  }

  getTurn() {
    return this.turn;
  }
}
