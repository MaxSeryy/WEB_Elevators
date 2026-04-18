import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend);

const labels = [
  '00:00', '01:00', '02:00', '03:00',
  '04:00', '05:00', '06:00', '07:00',
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00',
];

const elevatorSeries = {
  1: [2, 0, 0, 0, 0, 6, 32, 28, 12, 5, 3, 2, 12, 10, 4, 2, 22, 45, 42, 12, 4, 2, 0, 0],
  2: [0, 0, 0, 0, 1, 3, 12, 18, 26, 24, 16, 10, 14, 18, 16, 12, 20, 31, 28, 17, 10, 4, 1, 0],
  3: [1, 0, 0, 0, 2, 8, 24, 34, 38, 30, 18, 12, 20, 26, 24, 18, 25, 39, 44, 32, 21, 9, 2, 1],
  4: [0, 0, 0, 0, 1, 4, 10, 16, 20, 22, 24, 28, 30, 27, 25, 23, 20, 18, 16, 14, 9, 5, 2, 0],
};

function themeColors(isDark) {
  return {
    textColor: isDark ? '#f8fafc' : '#0f172a',
    gridColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)',
    gridBorderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.24)',
  };
}

export default function StatsPage({ isDark }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [selectedElevator, setSelectedElevator] = useState(1);

  const selectedData = useMemo(() => {
    return elevatorSeries[selectedElevator] || elevatorSeries[1];
  }, [selectedElevator]);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const colors = themeColors(isDark);
    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Навантаження ліфт №${selectedElevator} (%)`,
            data: selectedData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false, stepSize: 20 },
            grid: {
              display: true,
              color: colors.gridColor,
              borderColor: colors.gridBorderColor,
              lineWidth: 1,
            },
            border: { display: false },
          },
          x: {
            ticks: {
              color: colors.textColor,
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              font: { size: 11 },
            },
            grid: {
              display: true,
              color: colors.gridColor,
              borderColor: colors.gridBorderColor,
              lineWidth: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: { color: colors.textColor },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const colors = themeColors(isDark);
    chartRef.current.data.datasets[0].label = `Навантаження ліфт №${selectedElevator} (%)`;
    chartRef.current.data.datasets[0].data = selectedData;
    chartRef.current.options.scales.x.ticks.color = colors.textColor;
    chartRef.current.options.scales.x.grid.color = colors.gridColor;
    chartRef.current.options.scales.x.grid.borderColor = colors.gridBorderColor;
    chartRef.current.options.scales.y.grid.color = colors.gridColor;
    chartRef.current.options.scales.y.grid.borderColor = colors.gridBorderColor;
    chartRef.current.update();
  }, [selectedElevator, selectedData, isDark]);

  return (
    <main className="px-6 pt-2 md:pt-0 md:px-12 pb-12 flex-1 max-w-6xl mx-auto w-full">
      <section className="mb-12">
        <div className="mt-6 mb-8 md:mb-6 flex items-center justify-center gap-3 flex-wrap text-center">
          <h2 className="brand-normal mb-0">Статистика навантаження для ліфту:</h2>
          <label htmlFor="elevator-select" className="sr-only">Оберіть номер ліфту</label>
          <select
            id="elevator-select"
            value={selectedElevator}
            onChange={(event) => setSelectedElevator(Number(event.target.value))}
            className="h-11 rounded-lg border border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value={1}>Ліфт №1</option>
            <option value={2}>Ліфт №2</option>
            <option value={3}>Ліфт №3</option>
            <option value={4}>Ліфт №4</option>
          </select>
        </div>

        <div className="bg-slate-300 dark:bg-slate-800 rounded-3xl p-4 md:p-8 shadow-sm">
          <div className="chart-shell">
            <div className="chart-y-column">
              <div className="chart-y-title">Навантаження (%)</div>
              <ul className="chart-y-scale">
                <li>100</li>
                <li>80</li>
                <li>60</li>
                <li>40</li>
                <li>20</li>
                <li>0</li>
              </ul>
            </div>

            <div className="chart-scroll-wrap">
              <div className="chart-scroll-area">
                <div className="chart-scroll-content">
                  <canvas ref={canvasRef} height="320" />
                </div>
              </div>
              <p className="chart-x-title">Час (години)</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
