window.ElevatorChart = (function () {
  var chartInstance = null;
  var maxDataPoints = 20;
  var elevatorData = {
    1: [],
    2: [],
    3: [],
    4: [],
  };
  var timeLabels = [];

  var elevatorColors = {
    1: { border: 'rgb(59, 130, 246)', background: 'rgba(59, 130, 246, 0.1)' },
    2: { border: 'rgb(16, 185, 129)', background: 'rgba(16, 185, 129, 0.1)' },
    3: { border: 'rgb(251, 146, 60)', background: 'rgba(251, 146, 60, 0.1)' },
    4: { border: 'rgb(168, 85, 247)', background: 'rgba(168, 85, 247, 0.1)' },
  };

  function isDarkMode() {
    return document.documentElement.classList.contains('dark');
  }

  function getChartColors() {
    var isDark = isDarkMode();
    return {
      gridColor: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(148, 163, 184, 0.3)',
      textColor: isDark ? 'rgb(226, 232, 240)' : 'rgb(51, 65, 85)',
    };
  }

  function initChart() {
    var canvas = document.getElementById('elevator-chart');
    if (!canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var colors = getChartColors();

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [
          {
            label: 'Ліфт №1',
            data: elevatorData[1],
            borderColor: elevatorColors[1].border,
            backgroundColor: elevatorColors[1].background,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: 'Ліфт №2',
            data: elevatorData[2],
            borderColor: elevatorColors[2].border,
            backgroundColor: elevatorColors[2].background,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: 'Ліфт №3',
            data: elevatorData[3],
            borderColor: elevatorColors[3].border,
            backgroundColor: elevatorColors[3].background,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: 'Ліфт №4',
            data: elevatorData[4],
            borderColor: elevatorColors[4].border,
            backgroundColor: elevatorColors[4].background,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: colors.textColor,
              font: {
                size: 12,
                family: 'Inter, sans-serif',
              },
              padding: 15,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: isDarkMode() ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            borderColor: colors.gridColor,
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': Поверх ' + context.parsed.y;
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Час',
              color: colors.textColor,
              font: {
                size: 13,
                family: 'Inter, sans-serif',
              },
            },
            ticks: {
              color: colors.textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
            },
            grid: {
              color: colors.gridColor,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Поверх',
              color: colors.textColor,
              font: {
                size: 13,
                family: 'Inter, sans-serif',
              },
            },
            ticks: {
              color: colors.textColor,
              stepSize: 1,
            },
            grid: {
              color: colors.gridColor,
            },
          },
        },
      },
    });
  }

  function updateChartColors() {
    if (!chartInstance) {
      return;
    }

    var colors = getChartColors();

    chartInstance.options.scales.x.title.color = colors.textColor;
    chartInstance.options.scales.x.ticks.color = colors.textColor;
    chartInstance.options.scales.x.grid.color = colors.gridColor;

    chartInstance.options.scales.y.title.color = colors.textColor;
    chartInstance.options.scales.y.ticks.color = colors.textColor;
    chartInstance.options.scales.y.grid.color = colors.gridColor;

    chartInstance.options.plugins.legend.labels.color = colors.textColor;

    chartInstance.options.plugins.tooltip.backgroundColor = isDarkMode()
      ? 'rgba(15, 23, 42, 0.9)'
      : 'rgba(255, 255, 255, 0.9)';
    chartInstance.options.plugins.tooltip.titleColor = colors.textColor;
    chartInstance.options.plugins.tooltip.bodyColor = colors.textColor;
    chartInstance.options.plugins.tooltip.borderColor = colors.gridColor;

    chartInstance.update();
  }

  function addDataPoint(elevatorId, floor) {
    var now = new Date();
    var timeString = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    if (!elevatorData[elevatorId]) {
      return;
    }

    elevatorData[elevatorId].push(floor);

    if (elevatorId === '1') {
      timeLabels.push(timeString);

      if (timeLabels.length > maxDataPoints) {
        timeLabels.shift();
        Object.keys(elevatorData).forEach(function (id) {
          elevatorData[id].shift();
        });
      }
    }

    if (chartInstance) {
      chartInstance.update('none');
    }
  }

  // chart on DOM load
  window.addEventListener('DOMContentLoaded', function () {
    initChart();

    window.addEventListener('elevatorArrived', function (event) {
      var elevatorId = event.detail.elevatorId;
      var floor = event.detail.floor;
      addDataPoint(elevatorId, floor);
    });

    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        setTimeout(updateChartColors, 50);
      });
    }
  });

  return {
    addDataPoint: addDataPoint,
    updateColors: updateChartColors,
  };
})();
