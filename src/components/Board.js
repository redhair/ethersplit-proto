import { useState, useEffect, useCallback, memo } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';
import { CardSlot } from './CardSlot';
import { Card } from './Card';
import { ItemTypes } from './ItemTypes';

import update from 'immutability-helper';
export const Board = memo(function Board({ cardState, onSetCard }) {
  console.log('DEBUG Board === ', { cardState });
  const [cardSlots, setCardSlots] = useState([
    { accepts: [ItemTypes.CHAR], lastDroppedItem: null },
    { accepts: [ItemTypes.CHAR], lastDroppedItem: null },
    { accepts: [ItemTypes.CHAR], lastDroppedItem: null },
    { accepts: [ItemTypes.CHAR], lastDroppedItem: null },
    { accepts: [ItemTypes.CHAR], lastDroppedItem: null },
    { accepts: [ItemTypes.CHAR], lastDroppedItem: null },

    { accepts: [ItemTypes.WPN, ItemTypes.SPELL], lastDroppedItem: null },
    { accepts: [ItemTypes.WPN, ItemTypes.SPELL], lastDroppedItem: null },
    { accepts: [ItemTypes.WPN, ItemTypes.SPELL], lastDroppedItem: null },
    { accepts: [ItemTypes.WPN, ItemTypes.SPELL], lastDroppedItem: null },
    { accepts: [ItemTypes.WPN, ItemTypes.SPELL], lastDroppedItem: null },
    { accepts: [ItemTypes.WPN, ItemTypes.SPELL], lastDroppedItem: null },
  ]);
  const [cards] = useState([
    { name: 'DWARF', type: ItemTypes.CHAR },
    { name: 'MITHRIL SWORD', type: ItemTypes.WPN },
    { name: 'HASTE', type: ItemTypes.SPELL },
    { name: 'ELF', type: ItemTypes.CHAR },
    { name: 'HALFLING', type: ItemTypes.CHAR },
    { name: 'IRON SWORD', type: ItemTypes.WPN },
  ]);
  const [droppedCardNames, setDroppedCardNames] = useState([]);
  function isDropped(boxName) {
    return droppedCardNames.indexOf(boxName) > -1;
  }
  const handleDrop = useCallback(
    (index, item) => {
      const { name } = item;
      if (cardSlots[index].lastDroppedItem) return;
      setDroppedCardNames(update(droppedCardNames, name ? { $push: [name] } : { $push: [] }));
      setCardSlots(
        update(cardSlots, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedCardNames, cardSlots]
  );

  return (
    <div>
      <div className="grid grid-cols-6 gap-4 mx-6 pb-6">
        {cardSlots.map(({ accepts, lastDroppedItem }, index) => (
          <CardSlot
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => {
              onSetCard(index, item);
              handleDrop(index, item);
            }}
            key={index}
          />
        ))}

        {cards.map(({ name, type }, index) => (
          <Card name={name} type={type} isDropped={isDropped(name)} key={index} />
        ))}
      </div>
    </div>
  );
});
