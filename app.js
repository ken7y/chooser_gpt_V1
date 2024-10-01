const touchArea = document.getElementById('touchArea');

let currentTouches = [];
let touchElements = {};
let debounceTimeout = null;
let loadingTimeout = null;
let isLoading = false;

// Get reference to the reset button
const resetButton = document.getElementById('resetButton');

// Attach event listener to the reset button
resetButton.addEventListener('click', resetApp);

touchArea.addEventListener('touchstart', handleTouchStart, false);
touchArea.addEventListener('touchmove', handleTouchMove, false);
touchArea.addEventListener('touchend', handleTouchEnd, false);
touchArea.addEventListener('touchcancel', handleTouchEnd, false);

function handleTouchStart(event) {
  event.preventDefault();

  if (isLoading) {
    // Cancel loading if touch points change
    cancelLoading();
  }

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

  if (isLoading) {
    cancelLoading();
  }

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
    if (currentTouches.length > 0) {
      startLoadingAnimation();
    }
  }, 1000);
}

function startLoadingAnimation() {
  isLoading = true;
  debounceTimeout = null;

  // for (let touch of currentTouches) {
  //   const touchElement = touchElements[touch.identifier];
  //   if (touchElement) {
  //     touchElement.classList.add('loading');
  //     touchElement.classList.remove('touch-point'); // Remove initial animation
  //   }
  // }

  loadingTimeout = setTimeout(() => {
    if (isLoading) {
      selectRandomFinger();
    }
  }, 2000);
}

function cancelLoading() {
  isLoading = false;

  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  for (let touch of currentTouches) {
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchElement.classList.remove('loading');
      touchElement.classList.add('touch-point'); // Re-add initial animation
      touchElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }
}

function selectRandomFinger() {
  isLoading = false;
  loadingTimeout = null;

  const randomIndex = Math.floor(Math.random() * currentTouches.length);
  const selectedTouch = currentTouches[randomIndex];
  const touchElement = touchElements[selectedTouch.identifier];

  if (touchElement) {
    touchElement.classList.add('selected');

    for (let touch of currentTouches) {
      if (touch.identifier !== selectedTouch.identifier) {
        const otherElement = touchElements[touch.identifier];
        if (otherElement) {
          touchArea.removeChild(otherElement);
          delete touchElements[touch.identifier];
        }
      }
    }

    // setTimeout(() => {
    //   if (touchElement.parentNode) {
    //     touchArea.removeChild(touchElement);
    //     delete touchElements[selectedTouch.identifier];
    //   }
    // }, 10000);
  }

  currentTouches = currentTouches.filter(t => t.identifier === selectedTouch.identifier);

  // alert(`Selected finger at position: (${selectedTouch.clientX}, ${selectedTouch.clientY})`);
}

function resetApp() {
  // Cancel any ongoing timeouts
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = null;
  }
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  // Reset loading state
  isLoading = false;

  // Remove all touch elements from the screen
  for (let id in touchElements) {
    const touchElement = touchElements[id];
    if (touchElement && touchElement.parentNode) {
      touchArea.removeChild(touchElement);
    }
  }

  // Clear touch elements and current touches
  touchElements = {};
  currentTouches = [];
}
