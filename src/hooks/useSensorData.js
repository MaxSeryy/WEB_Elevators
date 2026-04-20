import { useEffect } from 'react';

export default function useSensorData({ updateInterval, setSystemState }) {
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    let isCancelled = false;

    async function fetchStatus() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/status`);

        if (!response.ok) {
          throw new Error(`Status request failed: ${response.status}`);
        }

        const payload = await response.json();
        const status = payload?.status;

        if (!status || isCancelled) {
          return;
        }

        setSystemState((prev) => ({
          ...prev,
          ui: {
            ...prev.ui,
            connectionLost: false,
          },
          dashboard: {
            ...prev.dashboard,
            sensors: {
              voltage: status.relayStatus ? 224 : 218,
              temperature: Number(status.temperature ?? prev.dashboard.sensors.temperature),
              load: Number(status.elevatorLoad ?? prev.dashboard.sensors.load),
              speed: status.relayStatus ? 1.6 : 0.8,
            },
          },
        }));
      } catch (_error) {
        if (isCancelled) {
          return;
        }

        setSystemState((prev) => ({
          ...prev,
          ui: {
            ...prev.ui,
            connectionLost: true,
          },
        }));
      }
    }

    fetchStatus();
    const timerId = window.setInterval(fetchStatus, updateInterval);

    return () => {
      isCancelled = true;
      window.clearInterval(timerId);
    };
  }, [updateInterval, setSystemState]);
}
