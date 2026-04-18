import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import useSensorData from './hooks/useSensorData';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';

function nowTime() {
  return new Date().toLocaleTimeString('uk-UA', { hour12: false });
}

function randomTarget(currentFloor, maxFloor) {
  let nextFloor = currentFloor;
  while (nextFloor === currentFloor) {
    nextFloor = Math.floor(Math.random() * maxFloor) + 1;
  }
  return nextFloor;
}

function appendLog(logs, message, type = 'info') {
  const nextLogs = [...logs, { id: Date.now() + Math.random(), time: nowTime(), type, message }];
  return nextLogs.slice(-50);
}

function withFloorsInRange(elevator, maxFloor) {
  const nextCurrent = Math.max(1, Math.min(maxFloor, elevator.currentFloor));
  const nextTarget = Math.max(1, Math.min(maxFloor, elevator.targetFloor));

  return {
    ...elevator,
    currentFloor: nextCurrent,
    targetFloor: nextTarget === nextCurrent ? randomTarget(nextCurrent, maxFloor) : nextTarget,
  };
}

const initialElevators = [
  { id: 1, currentFloor: 1, targetFloor: 4, doorOpen: true, direction: 'idle', idleTicks: 1 },
  { id: 2, currentFloor: 4, targetFloor: 2, doorOpen: false, direction: 'down', idleTicks: 1 },
  { id: 3, currentFloor: 3, targetFloor: 6, doorOpen: true, direction: 'idle', idleTicks: 1 },
  { id: 4, currentFloor: 6, targetFloor: 1, doorOpen: false, direction: 'down', idleTicks: 1 },
];

function Shell({ children, isDark, onToggleTheme, mobileOpen, onOpenMobile, onCloseMobile, onOpenSettings }) {
  return (
    <div className="bg-brand-bg text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={onCloseMobile} onOpenSettings={onOpenSettings} />

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header isDark={isDark} onToggleTheme={onToggleTheme} onToggleMobileMenu={onOpenMobile} />
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [systemState, setSystemState] = useState({
    ui: {
      isDark: true,
      mobileOpen: false,
      isSettingsOpen: false,
    },
    settings: {
      deviceName: 'Elevator Control System',
      maxFloor: 7,
      updateInterval: 1800,
    },
    dashboard: {
      isAlarmActive: true,
      sensors: {
        voltage: 220,
        temperature: 45,
        load: 35,
        speed: 1.2,
      },
      elevators: initialElevators,
      logs: [{ id: 1, time: nowTime(), type: 'action', message: 'Система запущена' }],
    },
  });

  useSensorData({
    updateInterval: systemState.settings.updateInterval,
    setSystemState,
  });

  useEffect(() => {
    let storedTheme = null;
    try {
      storedTheme = localStorage.getItem('theme');
    } catch (_error) {
      storedTheme = null;
    }

    const nextIsDark = storedTheme ? storedTheme === 'dark' : true;
    setSystemState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        isDark: nextIsDark,
      },
    }));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', systemState.ui.isDark);
    try {
      localStorage.setItem('theme', systemState.ui.isDark ? 'dark' : 'light');
    } catch (_error) {
      // Ignore storage write failures in restricted browser modes.
    }
  }, [systemState.ui.isDark]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', systemState.ui.mobileOpen);
  }, [systemState.ui.mobileOpen]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSystemState((prev) => {
        const arrivedMessages = [];

        const nextElevators = prev.dashboard.elevators.map((lift) => {
          if (lift.currentFloor === lift.targetFloor) {
            if (lift.idleTicks > 0) {
              return { ...lift, doorOpen: true, direction: 'idle', idleTicks: lift.idleTicks - 1 };
            }

            arrivedMessages.push(`Ліфт №${lift.id} прибув на поверх ${lift.currentFloor}`);
            return {
              ...lift,
              doorOpen: true,
              direction: 'idle',
              targetFloor: randomTarget(lift.currentFloor, prev.settings.maxFloor),
              idleTicks: 1,
            };
          }

          const direction = lift.targetFloor > lift.currentFloor ? 'up' : 'down';
          const nextFloor = lift.currentFloor + (direction === 'up' ? 1 : -1);
          return {
            ...lift,
            doorOpen: false,
            direction,
            currentFloor: Math.max(1, Math.min(prev.settings.maxFloor, nextFloor)),
          };
        });

        let nextLogs = prev.dashboard.logs;
        arrivedMessages.forEach((message) => {
          nextLogs = appendLog(nextLogs, message, 'action');
        });

        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            elevators: nextElevators,
            logs: nextLogs,
          },
        };
      });
    }, systemState.settings.updateInterval);

    return () => {
      window.clearInterval(timerId);
    };
  }, [systemState.settings.updateInterval]);

  function handleToggleTheme() {
    setSystemState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        isDark: !prev.ui.isDark,
      },
    }));
  }

  function handleOpenMobile() {
    setSystemState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        mobileOpen: true,
      },
    }));
  }

  function handleCloseMobile() {
    setSystemState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        mobileOpen: false,
      },
    }));
  }

  function handleOpenSettings() {
    setSystemState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        isSettingsOpen: true,
      },
    }));
  }

  function handleCloseSettings() {
    setSystemState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        isSettingsOpen: false,
      },
    }));
  }

  function handleToggleAlarm() {
    setSystemState((prev) => {
      const nextAlarmState = !prev.dashboard.isAlarmActive;
      const nextLogs = appendLog(
        prev.dashboard.logs,
        nextAlarmState ? 'Тривога активована' : 'Тривога вимкнена (Mute)',
        nextAlarmState ? 'error' : 'info'
      );

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          isAlarmActive: nextAlarmState,
          logs: nextLogs,
        },
      };
    });
  }

  function handleSaveSettings(nextSettings) {
    setSystemState((prev) => {
      let nextLogs = appendLog(
        prev.dashboard.logs,
        `Застосовано налаштування: maxFloor=${nextSettings.maxFloor}, interval=${nextSettings.updateInterval}мс`,
        'info'
      );

      return {
        ...prev,
        settings: nextSettings,
        ui: {
          ...prev.ui,
          isSettingsOpen: false,
        },
        dashboard: {
          ...prev.dashboard,
          logs: nextLogs,
          elevators: prev.dashboard.elevators.map((elevator) => withFloorsInRange(elevator, nextSettings.maxFloor)),
        },
      };
    });
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={(
            <Shell
              isDark={systemState.ui.isDark}
              onToggleTheme={handleToggleTheme}
              mobileOpen={systemState.ui.mobileOpen}
              onOpenMobile={handleOpenMobile}
              onCloseMobile={handleCloseMobile}
              onOpenSettings={handleOpenSettings}
            >
              <HomePage
                settings={systemState.settings}
                dashboard={systemState.dashboard}
                onToggleAlarm={handleToggleAlarm}
              />
            </Shell>
          )}
        />

        <Route
          path="/stats"
          element={(
            <Shell
              isDark={systemState.ui.isDark}
              onToggleTheme={handleToggleTheme}
              mobileOpen={systemState.ui.mobileOpen}
              onOpenMobile={handleOpenMobile}
              onCloseMobile={handleCloseMobile}
              onOpenSettings={handleOpenSettings}
            >
              <StatsPage isDark={systemState.ui.isDark} />
            </Shell>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SettingsModal
        isOpen={systemState.ui.isSettingsOpen}
        onClose={handleCloseSettings}
        settings={systemState.settings}
        onSave={handleSaveSettings}
      />
    </>
  );
}
