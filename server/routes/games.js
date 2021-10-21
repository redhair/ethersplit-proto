import { Game } from '../ethersplit/game';
import { Player } from '../ethersplit/player';

var express = require('express');
var router = express.Router();

/* GET games listing. */
router.get('/', function (req, res, next) {
  // return all games in play
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  // create a new game and return the id
  const deck = req.body.deck;
  //initialize player 1
  const player1 = new Player('Player 1', deck);

  // start game with player 1
  const game = new Game();
  game.addPlayer(player1);
  // GamePool.set({ id: game.getId(), game: game });

  res.json({ gameId: game.getId() });
});

router.get('/:id', function (req, res, next) {
  // return the game associated with the given game id
});

module.exports = router;
