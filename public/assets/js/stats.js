window.addEventListener('DOMContentLoaded', function () {
  var htmlElement = document.documentElement;
  var chart = null;
  var isDragging = false;
  var dragStartX = 0;
  var dragStartScrollLeft = 0;
  var elevatorSelect = document.getElementById('elevator-select');
  var labels = [
    '00:00', '01:00', '02:00', '03:00',
    '04:00', '05:00', '06:00', '07:00',
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'
  ];
  var elevatorSeries = {
    '1': [2, 0, 0, 0, 0, 6, 32, 28, 12, 5, 3, 2, 12, 10, 4, 2, 22, 45, 42, 12, 4, 2, 0, 0],
    '2': [0, 0, 0, 0, 1, 3, 12, 18, 26, 24, 16, 10, 14, 18, 16, 12, 20, 31, 28, 17, 10, 4, 1, 0],
    '3': [1, 0, 0, 0, 2, 8, 24, 34, 38, 30, 18, 12, 20, 26, 24, 18, 25, 39, 44, 32, 21, 9, 2, 1],
    '4': [0, 0, 0, 0, 1, 4, 10, 16, 20, 22, 24, 28, 30, 27, 25, 23, 20, 18, 16, 14, 9, 5, 2, 0],
  };

  function getSelectedElevatorId() {
    if (!elevatorSelect) {
      return '1';
    }

    return elevatorSelect.value in elevatorSeries ? elevatorSelect.value : '1';
  }

  function getSelectedSeries() {
    return elevatorSeries[getSelectedElevatorId()] || elevatorSeries['1'];
  }

  function getChartColors() {
    var isDark = htmlElement.classList.contains('dark');

    return {
      textColor: isDark ? '#f8fafc' : '#0f172a',
      gridColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)',
      gridBorderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.24)',
    };
  }

  function applyChartTheme() {
    if (!chart) {
      return;
    }

    var colors = getChartColors();

    chart.options.scales.x.ticks.color = colors.textColor;
    chart.options.scales.x.grid.color = colors.gridColor;
    chart.options.scales.x.grid.borderColor = colors.gridBorderColor;

    chart.options.scales.y.grid.color = colors.gridColor;
    chart.options.scales.y.grid.borderColor = colors.gridBorderColor;
    chart.update();
  }

  function updateChartByElevator() {
    if (!chart) {
      return;
    }

    var selectedId = getSelectedElevatorId();
    var selectedSeries = getSelectedSeries();

    chart.data.datasets[0].label = 'Навантаження ліфт №' + selectedId + ' (%)';
    chart.data.datasets[0].data = selectedSeries;
    chart.update();
  }

  if (window.AppTheme) {
    window.AppTheme.initThemeToggle({
      onThemeChange: applyChartTheme,
    });
    window.AppTheme.initMobileSidebar();
  }

  var canvas = document.getElementById('loadChart');
  var chartScroll = document.getElementById('chart-scroll');
  var chartContent = document.getElementById('chart-content');
  if (!canvas || typeof Chart === 'undefined') {
    return;
  }

  function initDragScroll(container) {
    if (!container) {
      return;
    }

    container.addEventListener('mousedown', function (event) {
      if (event.button !== 0) {
        return;
      }

      isDragging = true;
      dragStartX = event.clientX;
      dragStartScrollLeft = container.scrollLeft;
      container.classList.add('dragging');
      event.preventDefault();
    });

    container.addEventListener('mousemove', function (event) {
      if (!isDragging) {
        return;
      }

      var delta = event.clientX - dragStartX;
      container.scrollLeft = dragStartScrollLeft - delta;
    });

    function stopDragging() {
      isDragging = false;
      container.classList.remove('dragging');
    }

    container.addEventListener('mouseleave', stopDragging);
    container.addEventListener('mouseup', stopDragging);
    window.addEventListener('mouseup', stopDragging);
  }

  initDragScroll(chartScroll);

  if (chartContent) {
    var minChartWidth = Math.max(920, labels.length * 62);
    chartContent.style.minWidth = minChartWidth + 'px';
  }

  var colors = getChartColors();

  chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Навантаження ліфт №' + getSelectedElevatorId() + ' (%)',
          data: getSelectedSeries(),
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
          ticks: {
            display: false,
            stepSize: 20,
          },
          grid: {
            display: true,
            color: colors.gridColor,
            borderColor: colors.gridBorderColor,
            lineWidth: 1,
          },
          border: {
            display: false,
          },
        },
        x: {
          ticks: {
            color: colors.textColor,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            font: {
              size: 11,
            },
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
          labels: {
            color: colors.textColor,
          },
        },
      },
    },
  });

  if (elevatorSelect) {
    elevatorSelect.addEventListener('change', updateChartByElevator);
  }
});
