import { Player } from './player';
const uuidv4 = require('uuid').v4;
const messageExpirationTimeMS = 5 * 60 * 1000;
const _ = require('lodash');

export class Game {
  constructor(io, sockets, id) {
    this.turnOptions = ['drawCard', 'playCard', 'attack'];
    this.io = io;
    this.turn = 1;
    this.game = true;
    this.players = [];
    this.sockets = sockets;
    this.boardState = {
      [sockets[0].id]: {
        hand: [null, null, null, null, null, null],
        cardSlots: [null, null, null, null, null, null, null, null, null, null, null, null],
      },
      [sockets[1].id]: {
        hand: [null, null, null, null, null, null],
        cardSlots: [null, null, null, null, null, null, null, null, null, null, null, null],
      },
    };
    this.id = id;
    this._activePlayer = null;
    this.getTurn = this.getTurn.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    // this.setActivePlayer = this.setActivePlayer.bind(this);
    // this.getActivePlayer = this.getActivePlayer.bind(this);
    this.setGameOver = this.setGameOver.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.getId = this.getId.bind(this);
    this.setBoardState = this.setBoardState.bind(this);
    this.getBoardState = this.getBoardState.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
    this.getBoardStateChangeType = this.getBoardStateChangeType.bind(this);

    this.messages = new Set();
    this.users = new Map();
    this.defaultUser = {
      id: 'anon',
      name: 'Anonymous',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    };

    sockets.forEach((socket) => {
      console.log('Init handlers for: ', socket.id);
      socket.on('acceptChallenge', (msg) => {
        // console.log('in acceptChallenge', { msg });
        this.acceptChallenge(msg.player);
      });
      socket.on('changeBoardState', this.setBoardState);
      socket.on('getMessages', () => this.getMessages());
      socket.on('message', (value) => this.handleMessage(value));
      socket.on('disconnect', () => this.disconnect());
      socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    });
  }

  get activePlayer() {
    return this._activePlayer;
  }

  set activePlayer(player) {
    this._activePlayer = player;
  }

  getBoardStateChangeType(oldBoardState, newBoardState) {
    const playerId = getObjectDiff(oldBoardState, newBoardState);
    console.log({ playerId });
    const cardSlotDiff = getObjectDiff(oldBoardState[playerId].cardSlots, newBoardState[playerId].cardSlots);
    const handDiff = getObjectDiff(oldBoardState[playerId].hand, newBoardState[playerId].hand);

    /**
     * in order to determine if an attack was made,
     * we need to be looking for a DIFF between the HP
     * of the CharacterCards on the oldBoardState and the newBoardState
     */

    console.log({ cardSlotDiff, handDiff });

    if (handDiff.length > 0) {
      // drew a card
      this.turnOptions = this.turnOptions.filter((o) => o !== 'drawCard');
    }

    if (cardSlotDiff.length > 0) {
      // placed a card
      this.turnOptions = this.turnOptions.filter((o) => o !== 'playCard');
    }

    console.log('remaining turn options', this.turnOptions);

    /*
     * Compare two objects by reducing an array of keys in obj1, having the
     * keys in obj2 as the intial value of the result. Key points:
     *
     * - All keys of obj2 are initially in the result.
     *
     * - If the loop finds a key (from obj1, remember) not in obj2, it adds
     *   it to the result.
     *
     * - If the loop finds a key that are both in obj1 and obj2, it compares
     *   the value. If it's the same value, the key is removed from the result.
     */
    function getObjectDiff(obj1, obj2) {
      const diff = Object.keys(obj1).reduce((result, key) => {
        if (!obj2.hasOwnProperty(key)) {
          result.push(key);
        } else if (_.isEqual(obj1[key], obj2[key])) {
          const resultKeyIndex = result.indexOf(key);
          result.splice(resultKeyIndex, 1);
        }
        return result;
      }, Object.keys(obj2));

      return diff;
    }
  }

  acceptChallenge(player) {
    // console.log('ACCEPTED', { player });
    // add 2nd player and start gmae
    this.addPlayer(player);
    // console.log('DEBUG:', this.getPlayers().length);
    if (this.getPlayers().length === 2) {
      console.log('START FUNC');
      this.start();
    }
  }

  getPlayers() {
    return this.players;
  }

  setBoardState({ boardState, socketId, server }) {
    if (server) return;
    if (socketId === 'init') {
      console.log('init board state');
      console.log('1 active player: ', this.activePlayer);
      this.boardState = boardState;
      //broadcast update to sockets
      this.io.sockets.emit('changeBoardState', { boardState, server: true });
      return;
    }

    console.log({ socketId });
    console.log(socketId, ' is requesting to change boardState to: ', { boardState });
    console.log('activePlayer', this.activePlayer);
    if (socketId !== this.activePlayer.getId()) {
      this.io.to(socketId).emit('boardError', 'It is not your turn');
      return;
    }

    const changeType = this.getBoardStateChangeType(this.boardState, boardState);

    this.boardState = boardState;

    //broadcast update to sockets
    this.io.sockets.emit('changeBoardState', { boardState, server: true });
  }

  getBoardState() {
    return this.boardState;
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
    // console.log('ADD PLAYER', { player });
    this.players.push(new Player(player.name, player.deck, player.socketId));
  }

  start() {
    this.activePlayer = this.players[0];
    this.setBoardState({ boardState: this.boardState, socketId: 'init' });
    console.log('Board State:', this.getBoardState());
    this.io.sockets.emit('changeGameState', 'playing');
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

    // official start to the game

    // while (this.game) {
    //   const cardResult = await this.activePlayer.drawCard();
    //   console.log({ cardResult }, 'Player hand: ', this.activePlayer.hand);
    //   if (cardResult === true) {
    //     // broadcast to client
    //   }
    //   await waitForPlayer(this.activePlayer);
    //   const playResult = await this.activePlayer.playCard();
    //   console.log({ playResult });
    //   const attackResult = await this.activePlayer.attack();
    //   console.log({ attackResult });
    // }
  }

  setGameOver() {
    this.game = false;
  }

  nextTurn() {
    this.turn++;
  }

  getTurn() {
    return this.turn;
  }
}
