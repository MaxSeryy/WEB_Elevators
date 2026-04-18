import React from 'react';

export default function FloorColumn({ currentFloor, maxFloor }) {
  const floors = [];
  for (let floor = maxFloor; floor >= 1; floor -= 1) {
    floors.push(floor);
  }

  return (
    <div className="numbers">
      {floors.map((floor) => (
        <div key={floor} className={floor === currentFloor ? 'number-a' : 'number'}>
          {floor}
        </div>
      ))}
    </div>
  );
}
