import { memo } from 'react';
import { useDrag } from 'react-dnd';
const style = {
  cursor: 'move',
};
export const Card = memo(function Card({ name, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type]
  );

  if (isDropped) return <></>;

  return (
    <div className="'px-8 py-12 rounded-lg bg-gray-400" ref={drag} role="Card" style={{ ...style, opacity }}>
      {name}
    </div>
  );
});
