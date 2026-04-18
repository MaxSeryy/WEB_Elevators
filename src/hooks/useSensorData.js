import { useEffect } from 'react';

export default function useSensorData({ updateInterval, setSystemState }) {
  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSystemState((prev) => {
        const previousSensors = prev.dashboard.sensors;
        const nextTemperature = Number((previousSensors.temperature + (Math.random() * 8 - 3)).toFixed(1));
        const normalizedTemperature = Math.max(30, Math.min(70, nextTemperature));

        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            sensors: {
              voltage: Math.max(200, Math.min(240, Math.round(previousSensors.voltage + (Math.random() * 6 - 3)))),
              temperature: normalizedTemperature,
              load: Math.max(0, Math.min(100, Math.round(previousSensors.load + (Math.random() * 16 - 8)))),
              speed: Number(Math.max(0.2, Math.min(3.4, previousSensors.speed + (Math.random() * 0.6 - 0.3))).toFixed(1)),
            },
          },
        };
      });
    }, updateInterval);

    return () => {
      window.clearInterval(timerId);
    };
  }, [updateInterval, setSystemState]);
}
