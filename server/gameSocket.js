import { Game } from './ethersplit/game';
import { Player } from './ethersplit/player';

function gameSocket(io) {
  io.on('connection', async (socket) => {
    console.log('SOCKET ID:', socket.id);
    let id = socket.handshake.query.gameId;
    let sockets = await io.fetchSockets();
    if (!id) return;

    if (sockets.length === 2) {
      new Game(io, sockets, id);
    }
  });
}

module.exports = gameSocket;
