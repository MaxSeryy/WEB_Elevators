// event logs manager
window.LogsManager = (function () {
  var logsContainer = document.getElementById('logs-container');
  var maxLogs = 50;

  // format current time as HH:MM:SS
  function getTime() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  }

  // add new log entry with timestamp
  function addLog(action, type) {
    type = type || 'info';

    // create log entry element
    var entry = document.createElement('div');
    entry.className = 'log-entry';

    var timestamp = document.createElement('span');
    timestamp.className = 'log-timestamp';
    timestamp.textContent = getTime();

    var message = document.createElement('span');
    message.className = 'log-' + type;
    message.textContent = action;

    entry.appendChild(timestamp);
    entry.appendChild(message);

    if (!logsContainer) return;

    // remove placeholder if exists
    if (logsContainer.children.length === 1 && logsContainer.querySelector('div[style*="text-center"]')) {
      logsContainer.innerHTML = '';
    }

    logsContainer.appendChild(entry);

    // Keep only last 50 logs
    while (logsContainer.children.length > maxLogs) {
      logsContainer.removeChild(logsContainer.firstChild);
    }
  }

  function clearLogs() {
    if (logsContainer) {
      logsContainer.innerHTML = '';
    }
  }

  return {
    addLog: addLog,
    clearLogs: clearLogs,
  };
})();

// log system startup on page load
window.addEventListener('DOMContentLoaded', function () {
  if (window.LogsManager) {
    window.LogsManager.addLog('Система запущена', 'action');
  }
});
