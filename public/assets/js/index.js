// init theme and sidebar
window.addEventListener('DOMContentLoaded', function () {
  if (window.AppTheme) {
    window.AppTheme.initThemeToggle();
    window.AppTheme.initMobileSidebar();
  }

  // elevator settings
  var minFloor = 1;
  var maxFloor = 7;
  var tickMs = 1800; // update interval
  var elevatorIntervalId = null;

  // svg paths for direction arrows
  var directionPathByState = {
    up: 'M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18',
    down: 'M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3',
    idle: 'M6 12h12',
  };

  // generate random floor different from current
  function randomTarget(currentFloor) {
    var nextFloor = currentFloor;
    while (nextFloor === currentFloor) {
      nextFloor = Math.floor(Math.random() * (maxFloor - minFloor + 1)) + minFloor;
    }
    return nextFloor;
  }

  // add pulse animation to element
  function pulseValue(element) {
    if (!element) {
      return;
    }

    element.classList.remove('status-update');
    // Force reflow so animation restarts each time.
    void element.offsetWidth;
    element.classList.add('status-update');
  }

  // update door status and color
  function updateDoorText(doorElement, isOpen) {
    if (!doorElement) {
      return;
    }

    var nextText = isOpen ? 'відчинено' : 'зачинено';
    if (doorElement.textContent !== nextText) {
      doorElement.textContent = nextText;
      pulseValue(doorElement);
    }

    doorElement.classList.toggle('brand-small-red', isOpen);
    doorElement.classList.toggle('brand-small-green', !isOpen);
  }

  // update floor number
  function updateFloorText(floorElement, floorValue) {
    if (!floorElement) {
      return;
    }

    var nextText = String(floorValue);
    if (floorElement.textContent !== nextText) {
      floorElement.textContent = nextText;
      pulseValue(floorElement);
    }
  }

  // change arrow direction svg path
  function updateDirection(pathElement, directionState) {
    if (!pathElement) {
      return;
    }

    pathElement.setAttribute('d', directionPathByState[directionState] || directionPathByState.idle);
  }

  // highlight active floor in visual column
  function updateColumnAccent(columnElement, floorValue) {
    if (!columnElement) {
      return;
    }

    var items = columnElement.querySelectorAll('.number, .number-a');
    items.forEach(function (item) {
      var itemFloor = Number(item.textContent.trim());
      var isActive = itemFloor === floorValue;

      item.classList.toggle('number-a', isActive);
      item.classList.toggle('number', !isActive);
    });
  }

  // get all number columns for visual display
  var numberColumns = Array.prototype.slice.call(document.querySelectorAll('.numbers'));

  // init all elevators with initial state
  var elevatorStates = Array.prototype.slice.call(document.querySelectorAll('.elevator-card')).map(function (card, index) {
    var initialFloor = Number(card.getAttribute('data-initial-floor')) || minFloor;
    var floorElement = card.querySelector('.floor-value');
    var doorElement = card.querySelector('.door-value');
    var directionPath = card.querySelector('.direction-path');
    var numberColumn = numberColumns[index] || null;
    var currentFloor = Math.max(minFloor, Math.min(maxFloor, initialFloor));
    var targetFloor = randomTarget(currentFloor);

    return {
      card: card,
      floorElement: floorElement,
      doorElement: doorElement,
      directionPath: directionPath,
      numberColumn: numberColumn,
      currentFloor: currentFloor,
      targetFloor: targetFloor,
      doorOpen: true,
      idleTicks: 1,
    };
  });

  // main loop - update all elevators each tick
  function tickElevators() {
    elevatorStates.forEach(function (lift) {
      var direction = 'idle';

      // elevator reached target floor
      if (lift.currentFloor === lift.targetFloor) {
        lift.doorOpen = true;
        lift.card.classList.remove('is-moving');

        if (lift.idleTicks > 0) {
          lift.idleTicks -= 1;
        } else {
          lift.targetFloor = randomTarget(lift.currentFloor);
          lift.idleTicks = 1;
        }

        // Emit event on arrival
        if (lift.justArrived !== lift.currentFloor) {
          var elevatorId = lift.card.getAttribute('data-elevator-id');
          var event = new CustomEvent('elevatorArrived', {
            detail: {
              elevatorId: elevatorId,
              floor: lift.currentFloor,
            },
          });
          window.dispatchEvent(event);
          lift.justArrived = lift.currentFloor;
        }
      } else {
        // elevator is moving to target
        lift.doorOpen = false;
        lift.justArrived = null;
        direction = lift.targetFloor > lift.currentFloor ? 'up' : 'down';
        lift.currentFloor += direction === 'up' ? 1 : -1;
        lift.card.classList.add('is-moving');
      }

      updateFloorText(lift.floorElement, lift.currentFloor);
      updateDoorText(lift.doorElement, lift.doorOpen);
      updateDirection(lift.directionPath, direction);
      updateColumnAccent(lift.numberColumn, lift.currentFloor);
    });
  }

  // start simulation
  tickElevators();
  elevatorIntervalId = window.setInterval(tickElevators, tickMs);

  // Listen for settings changes
  window.addEventListener('settingsChanged', function (event) {
    var settings = event.detail;
    maxFloor = settings.maxFloor;
    tickMs = settings.updateInterval;

    // Restart interval with new timing
    if (elevatorIntervalId) {
      window.clearInterval(elevatorIntervalId);
    }
    elevatorIntervalId = window.setInterval(tickElevators, tickMs);

    if (window.LogsManager) {
      window.LogsManager.addLog('⚡ Інтервал оновлення: ' + tickMs + 'мс, макс поверх: ' + maxFloor, 'info');
    }
  });

  // Log elevator arrivals
  window.addEventListener('elevatorArrived', function (event) {
    var elevatorId = event.detail.elevatorId;
    var floor = event.detail.floor;
    if (window.LogsManager) {
      window.LogsManager.addLog('Ліфт №' + elevatorId + ' прибув на поверх ' + floor, 'action');
    }
  });
});
