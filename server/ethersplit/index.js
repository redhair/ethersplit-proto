import config from './config';

export class Card {
  constructor() {}
}

export class CharacterCard extends Card {
  constructor(race) {
    super(race);
    this.race = race;
    this.weapon = null;
    this.spell = null;
    this.hp = this.setHpByRace(race);

    this.setHpByRace = this.setHpByRace.bind(this);
    this.getRace = this.getRace.bind(this);
    this.getHP = this.getHP.bind(this);
    this.getAttack = this.getAttack.bind(this);
    this.getEquippedWeapon = this.getEquippedWeapon.bind(this);
    this.setEquippedWeapon = this.setEquippedWeapon.bind(this);
    this.getEquippedSpell = this.getEquippedSpell.bind(this);
    this.setEquippedSpell = this.setEquippedSpell.bind(this);
  }

  setEquippedWeapon(weapon) {
    if (this.race === 'GIANT') {
      throw new Error('Cannot equip weapons on Giants');
    }

    if (this.weapon == null) {
      this.weapon = weapon;
    }
  }

  getEquippedWeapon() {
    return this.weapon;
  }

  setEquippedSpell(spell) {
    if (this.spell == null) {
      this.spell = spell;
    }
  }

  getEquippedSpell() {
    return this.spell;
  }

  getSpellCastEffect() {
    const spellEffect = this.spell.getEffect();
    const turnMod = spellEffect['TURN_MOD'];
    const dmgMod = spellEffect['DMG_MOD'];
    const gameMod = spellEffect['GAME_MOD'];
    let turnModResult = {};
    let dmgModResult = {};
    let gameModResult = {};

    if (turnMod && config.racialPassiveMap[this.race]['SPELL_MOD']['TYPE'] === 'TURN_MOD') {
      // apply racial passives to this turn ability
      function calculateDuration(base, spellMod) {
        switch (spellMod.MOD) {
          case '*':
            return base * spellMod.VAL;
          case '/':
            return base / spellMod.VAL;
          case '-':
            return base - spellMod.VAL;
          case '+':
            return base + spellMod.VAL;
        }
      }

      turnModResult = {
        TURN_MOD: {
          MOD: turnMod.MOD,
          VAL: turnMod.VAL,
          DURATION: calculateDuration(turnMod.DURATION, config.racialPassiveMap[this.race]['SPELL_MOD']),
        },
      };
    }

    if (dmgMod && config.racialPassiveMap[this.race]['SPELL_MOD']['TYPE'] === 'DMG_MOD') {
      // apply racial passives to this dmg ability

      function calculateDmg(base, spellMod) {
        switch (spellMod.MOD) {
          case '*':
            return base * spellMod.VAL;
          case '/':
            return base / spellMod.VAL;
          case '-':
            return base - spellMod.VAL;
          case '+':
            return base + spellMod.VAL;
        }
      }

      dmgModResult = {
        DMG_MOD: {
          MOD: dmgMod.MOD,
          VAL: calculateDmg(dmgMod.VAL, config.racialPassiveMap[this.race]['SPELL_MOD']),
          DURATION: dmgMod.DURATION,
        },
      };
    }

    if (gameMod && config.racialPassiveMap[this.race]['SPELL_MOD']['TYPE'] === 'GAME_MOD') {
      // apply racial passives to this game ability
    }

    return {
      ...(!!turnMod && turnModResult),
      ...(!!dmgMod && dmgModResult),
      ...(!!gameMod && gameModResult),
    };
  }

  getAttack({ turn } = {}) {
    const dmgMod = config.racialPassiveMap[this.race]['DMG_MOD'];

    if (this.race === 'GIANT') {
      return { DMG: getGiantDmg(turn), ...(!!dmgMod && { DMG_MOD: dmgMod }) };
    }

    function getGiantDmg(turn) {
      if (!turn) {
        throw new Error('You must provide a turn number when calling getAttack from a Giant');
      }
      if (turn < 5) {
        return config.weaponGradeDmgMap.MELEE.IRON.DMG;
      } else if (turn < 10) {
        return config.weaponGradeDmgMap.MELEE.OBSIDIAN.DMG;
      } else if (turn < 15) {
        return config.weaponGradeDmgMap.MELEE.MITHRIL.DMG;
      } else {
        return config.weaponGradeDmgMap.MELEE.DIAMOND.DMG;
      }
    }

    const weaponMod = config.racialPassiveMap[this.race]['WEAPON_MOD'];
    const base = this.weapon.getDamage();
    const baseWeaponType = this.weapon.getType();

    function calculateDMG(base, weaponMod) {
      switch (weaponMod.MOD) {
        case '*':
          return base * weaponMod.VAL;
        case '/':
          return base / weaponMod.VAL;
        case '-':
          return base - weaponMod.VAL;
        case '+':
          return base + weaponMod.VAL;
      }
    }

    if (weaponMod && baseWeaponType === weaponMod.TYPE) {
      // calculate DMG modifier
      return { DMG: calculateDMG(base, weaponMod), ...(!!dmgMod && { DMG_MOD: dmgMod }) };
    } else {
      //return base dmg
      return { DMG: base, ...(!!dmgMod && { DMG_MOD: dmgMod }) };
    }
  }

  getHP() {
    return this.hp;
  }

  getRace() {
    return this.race;
  }

  setHpByRace(race) {
    const base = getBaseHP(race);
    const healthMod = config.racialPassiveMap[race]['HEALTH_MOD'];
    function getBaseHP() {
      switch (race) {
        case 'DWARF':
          return 100;
        case 'HUMAN':
          return 100;
        case 'VALKYRIE':
          return 100;
        case 'ELF':
          return 100;
        case 'HALFLING':
          return 100;
        case 'DEMON':
          return 100;
        case 'GIANT':
          return 100;
        case 'UNDEAD':
          return 100;
      }
    }

    function calculateHP(base, healthMod) {
      if (!healthMod) return base;
      switch (healthMod.MOD) {
        case '*':
          return base * healthMod.VAL;
        case '/':
          return base / healthMod.VAL;
        case '-':
          return base - healthMod.VAL;
        case '+':
          return base + healthMod.VAL;
      }
    }

    return calculateHP(base, healthMod);
  }
}

export class WeaponCard extends Card {
  constructor(type, grade) {
    super(type, grade);
    this.type = type;
    this.grade = grade;

    this.getType = this.getType.bind(this);
    this.getDamage = this.getDamage.bind(this);
  }

  getType() {
    return this.type;
  }

  getDamage() {
    return config.weaponGradeDmgMap[this.type][this.grade]['DMG'];
  }
}

export class SpellCard extends Card {
  constructor(spell) {
    super(spell);
    this.spell = spell;

    this.getEffect = this.getEffect.bind(this);
  }

  getEffect() {
    return config.spellEffectMap[this.spell];
  }
}

export class DeckBuilder {
  constructor() {
    this.deck = [];
    this.addCardToDeck = this.addCardToDeck.bind(this);
    this.getDeck = this.getDeck.bind(this);
    this.removeCardFromDeck = this.removeCardFromDeck.bind(this);
  }

  addCardToDeck(card) {
    if (this.deck.length >= 30) {
      throw new Error('You cannot add more than 30 cards to your deck');
    }
    this.deck.push(card);
  }

  removeCardFromDeck(card) {
    const index = this.deck.indexOf(card);
    if (index > -1) {
      this.deck.splice(index, 1);
    }
  }

  getDeck() {
    return this.deck;
  }
}
