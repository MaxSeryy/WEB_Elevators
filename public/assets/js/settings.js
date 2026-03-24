// settings modal manager
window.SettingsManager = (function () {
  // dom elements
  var modal = document.getElementById('settings-modal');
  var form = document.getElementById('settings-form');
  var closeBtn = document.getElementById('settings-close');
  var cancelBtn = document.getElementById('settings-cancel');
  var backdrop = document.querySelector('.settings-modal-backdrop');
  var settingsMessage = document.getElementById('settings-message');
  var settingsLinks = [
    document.getElementById('settings-link-desktop'),
    document.getElementById('settings-link-mobile'),
  ];

  // input fields
  var inputs = {
    deviceName: document.getElementById('device-name'),
    maxFloor: document.getElementById('max-floor'),
    updateInterval: document.getElementById('update-interval'),
  };

  // default values
  var currentSettings = {
    deviceName: 'Elevator Control System',
    maxFloor: 7,
    updateInterval: 1800,
  };

  // load settings from localStorage
  function loadSettings() {
    try {
      var stored = localStorage.getItem('elevatorSettings');
      if (stored) {
        var parsed = JSON.parse(stored);
        currentSettings = Object.assign({}, currentSettings, parsed);
      }
    } catch (_error) {
      // Ignore storage errors
    }

    // Update input values
    if (inputs.deviceName) inputs.deviceName.value = currentSettings.deviceName;
    if (inputs.maxFloor) inputs.maxFloor.value = currentSettings.maxFloor;
    if (inputs.updateInterval) inputs.updateInterval.value = currentSettings.updateInterval;
  }

  // save to localStorage
  function saveSettings(settings) {
    try {
      localStorage.setItem('elevatorSettings', JSON.stringify(settings));
    } catch (_error) {
      // Ignore storage errors
    }
  }

  // show success or error message
  function showMessage(text, type) {
    if (!settingsMessage) return;

    settingsMessage.textContent = text;
    settingsMessage.className = 'text-center brand-small settings-' + type;
    settingsMessage.classList.remove('hidden');

    setTimeout(function () {
      settingsMessage.classList.add('hidden');
    }, 3000);
  }

  function openModal() {
    if (!modal) return;
    loadSettings();
    modal.classList.add('open');
    document.body.classList.add('overflow-hidden');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
  }

  // form submit handler with validation
  function handleSubmit(event) {
    event.preventDefault();

    // validate inputs
    var deviceName = inputs.deviceName.value.trim();
    var maxFloor = parseInt(inputs.maxFloor.value, 10);
    var updateInterval = parseInt(inputs.updateInterval.value, 10);

    if (!deviceName) {
      showMessage('⚠ Назва системи не може бути порожня', 'error');
      return;
    }

    if (maxFloor < 2 || maxFloor > 20) {
      showMessage('⚠ Поверх повинен бути від 2 до 20', 'error');
      return;
    }

    if (updateInterval < 500 || updateInterval > 5000) {
      showMessage('⚠ Інтервал повинен бути від 500 до 5000 мс', 'error');
      return;
    }

    // Save settings
    currentSettings = {
      deviceName: deviceName,
      maxFloor: maxFloor,
      updateInterval: updateInterval,
    };

    saveSettings(currentSettings);

    // notify other components about settings change
    var event = new CustomEvent('settingsChanged', {
      detail: currentSettings,
    });
    window.dispatchEvent(event);

    showMessage('✓ Налаштування збережені', 'success');

    if (window.LogsManager) {
      window.LogsManager.addLog('⚙ Налаштування оновлені: ' + deviceName, 'action');
    }

    setTimeout(closeModal, 1500);
  }

  // attach event listeners
  if (settingsLinks.length) {
    settingsLinks.forEach(function (link) {
      if (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          openModal();
        });
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // close modal on escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // init settings on page load
  loadSettings();

  return {
    openModal: openModal,
    closeModal: closeModal,
    getCurrentSettings: function () {
      return Object.assign({}, currentSettings);
    },
  };
})();
