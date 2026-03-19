window.LogsManager = (function () {
  var logsContainer = document.getElementById('logs-container');
  var maxLogs = 50;

  function getTime() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  }

  function addLog(action, type) {
    type = type || 'info';

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

    // Clear placeholder if it exists
    if (logsContainer.children.length === 1 && logsContainer.querySelector('div[style*="text-center"]')) {
      logsContainer.innerHTML = '';
    }

    logsContainer.appendChild(entry);

    // Keep only last 50 logs
    while (logsContainer.children.length > maxLogs) {
      logsContainer.removeChild(logsContainer.firstChild);
    }

    // Auto-scroll to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight;
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

// Initialize with system start
window.addEventListener('DOMContentLoaded', function () {
  if (window.LogsManager) {
    window.LogsManager.addLog('✓ Система запущена', 'action');
  }
});
