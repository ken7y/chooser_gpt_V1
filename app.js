const touchArea = document.getElementById('touchArea');

let currentTouches = [];
let touchElements = {};
let debounceTimeout = null;
let loadingTimeout = null;
let isLoading = false;

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
    // Create a visual representation of the touch point
    const touchElement = document.createElement('div');
    touchElement.classList.add('touch-point');
    touchElement.style.left = `${touch.clientX}px`;
    touchElement.style.top = `${touch.clientY}px`;
    touchElement.id = `touch-${touch.identifier}`;
    touchArea.appendChild(touchElement);

    // Store the touch and its element
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
    // Cancel loading if touch points change
    cancelLoading();
  }

  for (let touch of event.changedTouches) {
    // Remove the visual representation
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchArea.removeChild(touchElement);
      delete touchElements[touch.identifier];
    }

    // Remove the touch from the currentTouches array
    currentTouches = currentTouches.filter(t => t.identifier !== touch.identifier);
  }

  resetDebounceTimer();
}

function resetDebounceTimer() {
  // Clear any existing debounce timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Set a new debounce timeout
  debounceTimeout = setTimeout(() => {
    // Proceed only if there are touches on the screen
    if (currentTouches.length > 1) {
      startLoadingAnimation();
    }
  }, 1000); // Debounce duration: 1000ms (1 second)
}

function startLoadingAnimation() {
  isLoading = true;
  debounceTimeout = null;

  // Apply loading animation to all touch points
  for (let touch of currentTouches) {
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchElement.classList.add('loading');
    }
  }

  // Set a timeout for when the loading animation ends
  loadingTimeout = setTimeout(() => {
    if (isLoading) {
      selectRandomFinger();
    }
  }, 2000); // Loading animation duration: 2000ms (2 seconds)
}

function cancelLoading() {
  isLoading = false;

  // Clear loading timeout
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  // Remove loading classes and reset touch elements
  for (let touch of currentTouches) {
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchElement.classList.remove('loading');
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
    // Remove loading animation classes
    touchElement.classList.remove('loading');
    touchElement.style.transform = 'translate(-50%, -50%) scale(1)';

    // Add the 'selected' class to change its appearance
    touchElement.classList.add('selected');

    // Remove other touch points
    for (let touch of currentTouches) {
      if (touch.identifier !== selectedTouch.identifier) {
        const otherElement = touchElements[touch.identifier];
        if (otherElement) {
          touchArea.removeChild(otherElement);
          delete touchElements[touch.identifier];
        }
      }
    }

    // Keep the selected touch point on screen for a while
    setTimeout(() => {
      if (touchElement.parentNode) {
        touchArea.removeChild(touchElement);
        delete touchElements[selectedTouch.identifier];
      }
    }, 3000); // Visible for 3 seconds
  }

  // Clear current touches except the selected one
  currentTouches = currentTouches.filter(t => t.identifier === selectedTouch.identifier);

  // Alert the user
  alert(`Selected finger at position: (${selectedTouch.clientX}, ${selectedTouch.clientY})`);
}
