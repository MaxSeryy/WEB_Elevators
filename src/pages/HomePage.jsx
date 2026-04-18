import React from 'react';
import ElevatorCard from '../components/ElevatorCard';
import FloorColumn from '../components/FloorColumn';
import LogsPanel from '../components/LogsPanel';
import SensorCard from '../components/SensorCard';

export default function HomePage({ settings, dashboard, onToggleAlarm }) {
  const { isAlarmActive, sensors, elevators, logs } = dashboard;

  return (
    <main className="px-6 md:px-12 pb-12 flex-1 max-w-6xl mx-auto w-full">
      <section className="mb-10 mt-2 md:mt-0">
        <div className="bg-slate-300 dark:bg-slate-800 rounded-3xl p-6 shadow-sm flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h2 className="brand-normal mb-1">{settings.deviceName || 'Elevator Control System'}</h2>
            <p className="brand-small">Стан тривоги: <span className={isAlarmActive ? 'brand-small-red' : 'brand-small-green'}>{isAlarmActive ? 'активна' : 'вимкнена'}</span></p>
          </div>
          <button
            type="button"
            onClick={onToggleAlarm}
            className={`px-5 py-2 rounded-lg font-medium transition ${isAlarmActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {isAlarmActive ? 'Mute' : 'Unmute'}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 mb-12">
        <SensorCard label="Voltage" value={sensors.voltage} unit="V" />
        <SensorCard label="Temperature" value={sensors.temperature} unit="°C" isDanger={sensors.temperature > 50} />
        <SensorCard label="Load" value={sensors.load} unit="%" isDanger={sensors.load > 85} />
        <SensorCard label="Speed" value={sensors.speed} unit="m/s" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 mb-12">
        {elevators.map((elevator) => (
          <ElevatorCard key={elevator.id} elevator={elevator} />
        ))}
      </section>

      <section className="hidden md:flex bg-slate-300 dark:bg-slate-800 rounded-3xl p-8 justify-around items-end overflow-x-auto shadow-sm mb-12">
        {elevators.map((elevator) => (
          <FloorColumn key={elevator.id} currentFloor={elevator.currentFloor} maxFloor={settings.maxFloor} />
        ))}
      </section>

      <LogsPanel logs={logs} />
    </main>
  );
}
