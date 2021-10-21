import { CharacterCard, SpellCard, WeaponCard, DeckBuilder, Player, Game } from '.';
import config from './config';

describe('Player', () => {});

describe('WeaponCard', () => {
  it('should return correct damage', () => {
    const weapon = new WeaponCard('MELEE', 'MITHRIL');

    expect(weapon.getDamage()).toEqual(6);
  });

  it('should return correct weapon type', () => {
    const weapon = new WeaponCard('RANGE', 'MITHRIL');

    expect(weapon.getType()).toEqual('RANGE');
  });
});

describe('SpellCard', () => {
  it('should return the spell effect', () => {
    const spell = new SpellCard('HASTE');

    expect(spell.getEffect()).toEqual({
      TURN_MOD: {
        MOD: '*',
        VAL: 2,
        DURATION: 3,
      },
    });
  });
});

describe('CharacterCard', () => {
  it('should apply the correct race', () => {
    const character = new CharacterCard('DWARF');

    expect(character.getRace()).toEqual('DWARF');
  });

  it('should correctly calculate HP based on race', () => {
    const character = new CharacterCard('DWARF');

    expect(character.getHP()).toEqual(200);
  });

  it('should apply HP racial bonus to dwarf', () => {
    const dwarf = new CharacterCard('DWARF');

    expect(dwarf.getHP()).toEqual(200);
  });

  it('should apply weapon mod racial bonus to valk', () => {
    //WEAPON_MOD
    const valk = new CharacterCard('VALKYRIE');
    const meleeWeapon = new WeaponCard('MELEE', 'DIAMOND');
    valk.setEquippedWeapon(meleeWeapon);

    expect(valk.getAttack()).toEqual({ DMG: 20 });
  });
  it('should apply weapon mod racial bonus to elf', () => {
    const elf = new CharacterCard('ELF');
    const rangeWeapon = new WeaponCard('RANGE', 'MITHRIL');
    elf.setEquippedWeapon(rangeWeapon);

    expect(elf.getAttack()).toEqual({ DMG: 12 });
  });

  it('should apply dmg mod racial bonus to halfling', () => {
    const halfling = new CharacterCard('HALFLING');
    const pWep = new WeaponCard('MELEE', 'DIAMOND');
    halfling.setEquippedWeapon(pWep);

    expect(halfling.getAttack()).toEqual({ DMG: 10, DMG_MOD: { MOD: '+', VAL: 2, DURATION: 3 } });
  });

  it('should throw if you try to equip a weapon on a giant', () => {
    const giant = new CharacterCard('GIANT');
    const wep = new WeaponCard('MELEE', 'DIAMOND');

    expect(() => giant.setEquippedWeapon(wep)).toThrowError();
  });

  it('should apply weapon mod racial passive to giant', () => {
    const giant = new CharacterCard('GIANT');

    expect(giant.getAttack({ turn: 4 })).toEqual({ DMG: 1 });
    expect(giant.getAttack({ turn: 5 })).toEqual({ DMG: 3 });

    expect(giant.getAttack({ turn: 9 })).toEqual({ DMG: 3 });
    expect(giant.getAttack({ turn: 10 })).toEqual({ DMG: 6 });

    expect(giant.getAttack({ turn: 14 })).toEqual({ DMG: 6 });
    expect(giant.getAttack({ turn: 15 })).toEqual({ DMG: 10 });
  });

  it('should throw if no turn number provided for giant attack', () => {
    const giant = new CharacterCard('GIANT');

    expect(() => giant.getAttack()).toThrowError();
  });

  it('should apply spell mod racial bonus to human', () => {
    const human = new CharacterCard('HUMAN');
    const spell = new SpellCard('HASTE');
    human.setEquippedSpell(spell);

    expect(human.getSpellCastEffect()).toEqual({
      TURN_MOD: {
        DURATION: 6,
        MOD: '*',
        VAL: 2,
      },
    });
  });

  it('should apply spell mod racial bonus to demon', () => {
    const demon = new CharacterCard('DEMON');
    const spell = new SpellCard('PANDEMIC');
    demon.setEquippedSpell(spell);

    expect(demon.getSpellCastEffect()).toEqual({
      DMG_MOD: {
        DURATION: 3,
        MOD: undefined,
        VAL: 4,
      },
    });
  });

  it('should apply spell mod racial bonus to undead', () => {
    const demon = new CharacterCard('UNDEAD');
    const spell = new SpellCard('PANDEMIC');
    demon.setEquippedSpell(spell);

    expect(demon.getSpellCastEffect()).toEqual({
      DMG_MOD: {
        DURATION: 3,
        MOD: undefined,
        VAL: 4,
      },
    });
  });
});

describe('DeckBuilder', () => {
  it('should return the contents of the deck', () => {
    const deck = new DeckBuilder();

    expect(deck.getDeck()).toEqual([]);
  });

  it('should add a card to the deck', () => {
    const deck = new DeckBuilder();
    const character = new CharacterCard('DWARF');
    deck.addCardToDeck(character);
    expect(deck.getDeck()).toEqual([character]);
  });

  it('should remove a card from the deck', () => {
    const deck = new DeckBuilder();
    const character = new CharacterCard('DWARF');
    const spell = new SpellCard('HASTE');
    const weapon = new WeaponCard('DIAMOND', 'MELEE');

    //add 3 cards
    deck.addCardToDeck(character);
    deck.addCardToDeck(spell);
    deck.addCardToDeck(weapon);

    //remove the spell card
    deck.removeCardFromDeck(spell);

    expect(deck.getDeck()).toEqual([character, weapon]);
  });

  it('should not allow you to add more than 30 cards', () => {
    const deck = new DeckBuilder();
    const character = new CharacterCard('DWARF');

    for (let i = 0; i < 30; i++) {
      deck.addCardToDeck(character);
    }

    expect(() => {
      deck.addCardToDeck(character);
    }).toThrowError();
  });
});
