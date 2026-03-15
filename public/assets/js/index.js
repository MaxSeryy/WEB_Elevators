window.addEventListener('DOMContentLoaded', function () {
  if (window.AppTheme) {
    window.AppTheme.initThemeToggle();
    window.AppTheme.initMobileSidebar();
  }

  var minFloor = 1;
  var maxFloor = 7;
  var tickMs = 1800;
  var directionPathByState = {
    up: 'M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18',
    down: 'M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3',
    idle: 'M6 12h12',
  };

  function randomTarget(currentFloor) {
    var nextFloor = currentFloor;
    while (nextFloor === currentFloor) {
      nextFloor = Math.floor(Math.random() * (maxFloor - minFloor + 1)) + minFloor;
    }
    return nextFloor;
  }

  function pulseValue(element) {
    if (!element) {
      return;
    }

    element.classList.remove('status-update');
    // Force reflow so animation restarts each time.
    void element.offsetWidth;
    element.classList.add('status-update');
  }

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

  function updateDirection(pathElement, directionState) {
    if (!pathElement) {
      return;
    }

    pathElement.setAttribute('d', directionPathByState[directionState] || directionPathByState.idle);
  }

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

  var numberColumns = Array.prototype.slice.call(document.querySelectorAll('.numbers'));

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

  function tickElevators() {
    elevatorStates.forEach(function (lift) {
      var direction = 'idle';

      if (lift.currentFloor === lift.targetFloor) {
        lift.doorOpen = true;
        lift.card.classList.remove('is-moving');

        if (lift.idleTicks > 0) {
          lift.idleTicks -= 1;
        } else {
          lift.targetFloor = randomTarget(lift.currentFloor);
          lift.idleTicks = 1;
        }
      } else {
        lift.doorOpen = false;
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

  tickElevators();
  window.setInterval(tickElevators, tickMs);
});
