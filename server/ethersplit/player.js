export class Player {
  constructor(name, deck, id) {
    this.name = name;
    this.deck = deck;
    this.hand = [];
    this.id = id;

    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.playCard = this.playCard.bind(this);
    this.attack = this.attack.bind(this);
    this.getId = this.getId.bind(this);
  }

  getId() {
    return this.id;
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  async drawCard() {
    return new Promise((resolve, reject) => {
      this.hand.push(this.deck.pop());
      resolve(true);
    });
  }

  async playCard(i) {
    // can place 1 card per turn
    return new Promise((resolve, reject) => {
      resolve(this.hand[i]);
    });
  }

  async attack() {
    // for each character on the board, attack
  }
}
