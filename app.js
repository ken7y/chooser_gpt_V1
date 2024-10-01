const touchArea = document.getElementById('touchArea');

let currentTouches = [];
let touchElements = {};
let debounceTimeout = null;

touchArea.addEventListener('touchstart', handleTouchStart, false);
touchArea.addEventListener('touchmove', handleTouchMove, false);
touchArea.addEventListener('touchend', handleTouchEnd, false);
touchArea.addEventListener('touchcancel', handleTouchEnd, false);

function handleTouchStart(event) {
  event.preventDefault();

  for (let touch of event.changedTouches) {
    const touchElement = document.createElement('div');
    touchElement.classList.add('touch-point');
    touchElement.style.left = `${touch.clientX}px`;
    touchElement.style.top = `${touch.clientY}px`;
    touchElement.id = `touch-${touch.identifier}`;
    touchArea.appendChild(touchElement);

    currentTouches.push(touch);
    touchElements[touch.identifier] = touchElement;
  }

  resetDebounceTimer();
}

function handleTouchMove(event) {
  event.preventDefault();

  for (let touch of event.changedTouches) {
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchElement.style.left = `${touch.clientX}px`;
      touchElement.style.top = `${touch.clientY}px`;
    }
  }
}

function handleTouchEnd(event) {
  event.preventDefault();

  for (let touch of event.changedTouches) {
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchArea.removeChild(touchElement);
      delete touchElements[touch.identifier];
    }

    currentTouches = currentTouches.filter(t => t.identifier !== touch.identifier);
  }

  resetDebounceTimer();
}

function resetDebounceTimer() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    if (currentTouches.length > 1) {
      selectRandomFinger(currentTouches);
    }
  }, 3000);
}

function selectRandomFinger(touchList) {
  debounceTimeout = null;

  const randomIndex = Math.floor(Math.random() * touchList.length);
  const selectedTouch = touchList[randomIndex];

  const touchElement = touchElements[selectedTouch.identifier];

  if (touchElement) {
    // Add the 'selected' class to change its appearance
    touchElement.classList.add('selected');

    // Remove other touch points
    for (let id in touchElements) {
      if (parseInt(id) !== selectedTouch.identifier) {
        touchArea.removeChild(touchElements[id]);
        delete touchElements[id];
      }
    }

    // Keep the selected touch point on screen for a while
    setTimeout(() => {
      if (touchElement.parentNode) {
        touchArea.removeChild(touchElement);
      }
    }, 3000); // Visible for 3 seconds
  }

  // Alert the user
//   alert(`Selected finger at position: (${selectedTouch.clientX}, ${selectedTouch.clientY})`);
}
