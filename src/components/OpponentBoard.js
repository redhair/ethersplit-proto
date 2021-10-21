import { useState, useEffect, useCallback, memo } from 'react';
import OpponentCardSlot from './OpponentCardSlot';

export function OpponentBoard({ boardState }) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-4 mx-6 my-12">
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
        <OpponentCardSlot />
      </div>
    </div>
  );
}
