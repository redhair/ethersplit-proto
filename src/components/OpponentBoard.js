// import { useState, useEffect, useCallback, memo } from 'react';
import OpponentCardSlot from './OpponentCardSlot';

export function OpponentBoard({ cardState }) {
  console.log('DEBUG === Opponent', { cardState });
  return (
    <div>
      <div className="grid grid-cols-6 gap-4 mx-6">
        {cardState.map((c) => {
          let title = c ? c.name : 'none';
          return <OpponentCardSlot title={title} />;
        })}
      </div>
    </div>
  );
}
