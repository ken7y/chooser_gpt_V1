const touchArea = document.getElementById("touchArea") as HTMLElement;

let currentTouches: Touch[] = [];
let touchElements: { [key: number]: HTMLElement } = {};
let debounceTimeout: number | null = null;
let loadingTimeout: number | null = null;
let isLoading = false;

// touchArea event listeners
touchArea.addEventListener("touchstart", handleTouchStart, false);
touchArea.addEventListener("touchmove", handleTouchMove, false);
touchArea.addEventListener("touchend", handleTouchEnd, false);
touchArea.addEventListener("touchcancel", handleTouchEnd, false);

// Handle touch start event
function handleTouchStart(event: TouchEvent) {
  event.preventDefault();
  if (isLoading) {
    cancelLoading();
  }

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchElement = document.createElement("div");
    touchElement.classList.add("touch-point");
    touchElement.style.left = `${touch.clientX}px`;
    touchElement.style.top = `${touch.clientY}px`;
    touchElement.id = `touch-${touch.identifier}`;
    touchArea.appendChild(touchElement);

    currentTouches.push(touch);
    touchElements[touch.identifier] = touchElement;
  }
  resetAnimations();
  resetDebounceTimer();
}

// Handle touch move event
function handleTouchMove(event: TouchEvent) {
  event.preventDefault();

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchElement.style.left = `${touch.clientX}px`;
      touchElement.style.top = `${touch.clientY}px`;
    }
  }
}

// Handle touch end event
function handleTouchEnd(event: TouchEvent) {
  event.preventDefault();
  resetAnimations();

  if (isLoading) {
    cancelLoading();
  }

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchArea.removeChild(touchElement);
      delete touchElements[touch.identifier];
    }

    currentTouches = currentTouches.filter(
      (t) => t.identifier !== touch.identifier
    );

    if (currentTouches.length === 0){
      resetApp();
    }
  }

  resetDebounceTimer();
}

// Reset debounce timer for loading animation
function resetDebounceTimer() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = window.setTimeout(() => {
    if (currentTouches.length > 0) {
      startLoadingAnimation();
    }
  }, 1500);
}

// Start the loading animation
function startLoadingAnimation() {
  isLoading = true;
  debounceTimeout = null;

  loadingTimeout = window.setTimeout(() => {
    if (isLoading) {
      selectRandomFinger();
    }
  }, 1500);
}

// Cancel loading animation
function cancelLoading() {
  isLoading = false;
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
}

// Select a random touch point and remove others
function selectRandomFinger() {
  isLoading = false;
  loadingTimeout = null;

  const randomIndex = Math.floor(Math.random() * currentTouches.length);
  const selectedTouch = currentTouches[randomIndex];
  const touchElement = touchElements[selectedTouch.identifier];

  if (touchElement) {
    touchElement.classList.add("selected");
    for (let touch of currentTouches) {
      if (touch.identifier !== selectedTouch.identifier) {
        const otherElement = touchElements[touch.identifier];
        if (otherElement) {
          touchArea.removeChild(otherElement);
          delete touchElements[touch.identifier];
        }
      }
    }
  }

  currentTouches = currentTouches.filter(
    (t) => t.identifier === selectedTouch.identifier
  );
}

// Reset the app state and remove all touch points
function resetApp() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = null;
  }
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  isLoading = false;

  for (let identifier in touchElements) {
    const touchElement = touchElements[identifier];
    if (touchElement && touchElement.parentNode) {
      touchArea.removeChild(touchElement);
    }
  }

  touchElements = {};
  currentTouches = [];
}

// Reset animations for all current touch points
function resetAnimations() {
  for (let touch of currentTouches) {
    const touchElement = touchElements[touch.identifier];
    if (touchElement) {
      touchElement.style.animation = "none";
      setTimeout(() => {
        touchElement.style.animation = "";
      }, 0);
    }
  }
}
