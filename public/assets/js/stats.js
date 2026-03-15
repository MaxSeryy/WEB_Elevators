window.addEventListener('DOMContentLoaded', function () {
  var htmlElement = document.documentElement;
  var chart = null;

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
    chart.options.scales.x.title.color = colors.textColor;
    chart.options.scales.x.grid.color = colors.gridColor;
    chart.options.scales.x.grid.borderColor = colors.gridBorderColor;

    chart.options.scales.y.ticks.color = colors.textColor;
    chart.options.scales.y.title.color = colors.textColor;
    chart.options.scales.y.grid.color = colors.gridColor;
    chart.options.scales.y.grid.borderColor = colors.gridBorderColor;

    chart.options.plugins.legend.labels.color = colors.textColor;
    chart.update();
  }

  if (window.AppTheme) {
    window.AppTheme.initThemeToggle({
      onThemeChange: applyChartTheme,
    });
  }

  var canvas = document.getElementById('loadChart');
  if (!canvas || typeof Chart === 'undefined') {
    return;
  }

  var colors = getChartColors();

  chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: [
        '00:00', '01:00', '02:00', '03:00',
        '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00',
        '20:00', '21:00', '22:00', '23:00'
      ],
      datasets: [
        {
          label: 'Навантаження %',
          data: [2, 0, 0, 0, 0, 6, 32, 28, 12, 5, 3, 2, 12, 10, 4, 2, 22, 45, 42, 12, 4, 2, 0, 0],
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
          title: {
            display: true,
            text: 'Навантаження (%)',
            color: colors.textColor,
          },
          ticks: {
            color: colors.textColor,
          },
          grid: {
            display: true,
            color: colors.gridColor,
            borderColor: colors.gridBorderColor,
            lineWidth: 1,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Час (години)',
            color: colors.textColor,
          },
          ticks: {
            color: colors.textColor,
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
          labels: {
            color: colors.textColor,
          },
        },
      },
    },
  });
});
