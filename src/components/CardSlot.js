import { memo } from 'react';
import { useDrop } from 'react-dnd';

export const CardSlot = memo(function CardSlot({ accept, lastDroppedItem, onDrop }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;
  let backgroundColor = 'bg-white';
  if (isActive) {
    backgroundColor = 'bg-green-500';
  } else if (canDrop) {
    backgroundColor = 'bg-red-500';
  }
  return (
    <div
      className={'px-8 py-12 rounded-lg bg-white border border-gray-400 ' + backgroundColor}
      ref={drop}
      role="CardSlot"
    >
      {isActive ? 'Release to drop' : !lastDroppedItem && `Accepts: ${accept.join(', ')}`}

      {lastDroppedItem && <p>{JSON.stringify(lastDroppedItem)}</p>}
    </div>
  );
});
