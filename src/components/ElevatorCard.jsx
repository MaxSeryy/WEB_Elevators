import React from 'react';

const directionPathByState = {
  up: 'M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18',
  down: 'M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3',
  idle: 'M6 12h12',
};

export default function ElevatorCard({ elevator }) {
  const doorClass = elevator.doorOpen ? 'brand-small-red' : 'brand-small-green';
  const doorText = elevator.doorOpen ? 'відчинено' : 'зачинено';

  return (
    <article className={`card elevator-card ${elevator.direction === 'idle' ? '' : 'is-moving'}`}>
      <h2 className="brand-normal">Ліфт №{elevator.id}</h2>
      <p className="brand-small">Поверх: <span className="brand-small-a floor-value">{elevator.currentFloor}</span></p>
      <p className="brand-small">Двері: <span className={`door-value ${doorClass}`}>{doorText}</span></p>
      <div className="flex space-x-1 mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 direction-icon">
          <path className="direction-path" strokeLinecap="round" strokeLinejoin="round" d={directionPathByState[elevator.direction]} />
        </svg>
      </div>
    </article>
  );
}
