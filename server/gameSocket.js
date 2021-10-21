import { Game } from './ethersplit/game';

function gameSocket(io) {
  const players = [];
  let game = null;

  io.on('connection', (socket) => {
    // console.log(socket.id);
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
