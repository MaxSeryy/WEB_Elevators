import React, { useEffect, useMemo, useState } from 'react';
import ElevatorCard from '../components/ElevatorCard';
import FloorColumn from '../components/FloorColumn';
import LogsPanel from '../components/LogsPanel';
import SensorCard from '../components/SensorCard';

function nowTime() {
  return new Date().toLocaleTimeString('uk-UA', { hour12: false });
}

function randomTarget(currentFloor, maxFloor) {
  let next = currentFloor;
  while (next === currentFloor) {
    next = Math.floor(Math.random() * maxFloor) + 1;
  }
  return next;
}

const initialElevators = [
  { id: 1, currentFloor: 1, targetFloor: 4, doorOpen: true, direction: 'idle', idleTicks: 1 },
  { id: 2, currentFloor: 4, targetFloor: 2, doorOpen: false, direction: 'down', idleTicks: 1 },
  { id: 3, currentFloor: 3, targetFloor: 6, doorOpen: true, direction: 'idle', idleTicks: 1 },
  { id: 4, currentFloor: 6, targetFloor: 1, doorOpen: false, direction: 'down', idleTicks: 1 },
];

export default function HomePage({ settings }) {
  const [isAlarmActive, setIsAlarmActive] = useState(true);
  const [sensors, setSensors] = useState({
    voltage: 220,
    temperature: 45,
    load: 35,
    speed: 1.2,
  });
  const [elevators, setElevators] = useState(initialElevators);
  const [logs, setLogs] = useState([{ id: 1, time: nowTime(), type: 'action', message: 'Система запущена' }]);

  const addLog = useMemo(() => {
    return (message, type = 'info') => {
      setLogs((prev) => {
        const next = [...prev, { id: Date.now() + Math.random(), time: nowTime(), type, message }];
        return next.slice(-50);
      });
    };
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSensors((prev) => {
        const nextTemperature = Number((prev.temperature + (Math.random() * 8 - 3)).toFixed(1));
        const normalizedTemperature = Math.max(30, Math.min(70, nextTemperature));

        return {
          voltage: Math.max(200, Math.min(240, Math.round(prev.voltage + (Math.random() * 6 - 3)))),
          temperature: normalizedTemperature,
          load: Math.max(0, Math.min(100, Math.round(prev.load + (Math.random() * 16 - 8)))),
          speed: Number(Math.max(0.2, Math.min(3.4, prev.speed + (Math.random() * 0.6 - 0.3))).toFixed(1)),
        };
      });

      setElevators((prev) => {
        return prev.map((lift) => {
          if (lift.currentFloor === lift.targetFloor) {
            if (lift.idleTicks > 0) {
              return { ...lift, doorOpen: true, direction: 'idle', idleTicks: lift.idleTicks - 1 };
            }

            addLog(`Ліфт №${lift.id} прибув на поверх ${lift.currentFloor}`, 'action');
            return {
              ...lift,
              doorOpen: true,
              direction: 'idle',
              targetFloor: randomTarget(lift.currentFloor, settings.maxFloor),
              idleTicks: 1,
            };
          }

          const direction = lift.targetFloor > lift.currentFloor ? 'up' : 'down';
          const nextFloor = lift.currentFloor + (direction === 'up' ? 1 : -1);
          return {
            ...lift,
            doorOpen: false,
            direction,
            currentFloor: Math.max(1, Math.min(settings.maxFloor, nextFloor)),
          };
        });
      });
    }, settings.updateInterval);

    return () => {
      window.clearInterval(timerId);
    };
  }, [settings.maxFloor, settings.updateInterval, addLog]);

  useEffect(() => {
    addLog(isAlarmActive ? 'Тривога активована' : 'Тривога вимкнена (Mute)', isAlarmActive ? 'error' : 'info');
  }, [isAlarmActive, addLog]);

  useEffect(() => {
    addLog(`Застосовано налаштування: maxFloor=${settings.maxFloor}, interval=${settings.updateInterval}мс`, 'info');
  }, [settings.maxFloor, settings.updateInterval, addLog]);

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
            onClick={() => setIsAlarmActive((prev) => !prev)}
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
