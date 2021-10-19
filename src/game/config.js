const config = {
  racialPassiveMap: {
    DWARF: {
      HEALTH_MOD: {
        MOD: '*',
        VAL: '2',
      },
    },
    HUMAN: {
      SPELL_MOD: {
        TYPE: 'TURN_MOD',
        MOD: '*',
        VAL: '2',
      },
    },
    VALKYRIE: {
      WEAPON_MOD: {
        TYPE: 'MELEE',
        MOD: '*',
        VAL: '2',
      },
    },
    ELF: {
      WEAPON_MOD: {
        TYPE: 'RANGE',
        MOD: '*',
        VAL: '2',
      },
    },
    HALFLING: {
      DMG_MOD: {
        MOD: '+',
        VAL: 2,
        DURATION: 3,
      },
    },
    DEMON: {
      SPELL_MOD: {
        TYPE: 'DMG_MOD',
        MOD: '*',
        VAL: 2,
      },
    },
    GIANT: {
      WEAPON_MOD: 'giant',
    },
    UNDEAD: {
      SPELL_MOD: {
        TYPE: 'DMG_MOD',
        MOD: '+',
        VAL: 2,
      },
    },
  },
  weaponGradeDmgMap: {
    MELEE: {
      IRON: { DMG: 1 },
      OBSIDIAN: { DMG: 3 },
      MITHRIL: { DMG: 6 },
      DIAMOND: { DMG: 10 },
      MYSTIC: { DMG: 16 },
    },
    RANGE: {
      IRON: { DMG: 1 },
      OBSIDIAN: { DMG: 3 },
      MITHRIL: { DMG: 6 },
      DIAMOND: { DMG: 10 },
      MYSTIC: { DMG: 16 },
    },
  },
  spellEffectMap: {
    HASTE: {
      TURN_MOD: {
        MOD: '*',
        VAL: 2,
        DURATION: 3,
      },
    },
    TIME_ROT: {
      TURN_MOD: {
        MOD: '*',
        VAL: 0,
        DURATION: 2,
      },
    },
    PANDEMIC: {
      DMG_MOD: {
        VAL: 2,
        DURATION: 3,
      },
    },
    EVENT_HORIZON: {
      DMG_MOD: '9999',
    },
    SINGULARITY: {
      GAME_MOD: 'END',
    },
  },
};

export default config;
