"use strict";
var touchArea = document.getElementById("touchArea");
var currentTouches = [];
var touchElements = {};
var debounceTimeout = null;
var loadingTimeout = null;
var isLoading = false;
// touchArea event listeners
touchArea.addEventListener("touchstart", handleTouchStart, false);
touchArea.addEventListener("touchmove", handleTouchMove, false);
touchArea.addEventListener("touchend", handleTouchEnd, false);
touchArea.addEventListener("touchcancel", handleTouchEnd, false);
// Handle touch start event
function handleTouchStart(event) {
    event.preventDefault();
    if (isLoading) {
        cancelLoading();
    }
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var touchElement = document.createElement("div");
        touchElement.classList.add("touch-point");
        touchElement.style.left = "".concat(touch.clientX, "px");
        touchElement.style.top = "".concat(touch.clientY, "px");
        touchElement.id = "touch-".concat(touch.identifier);
        touchArea.appendChild(touchElement);
        currentTouches.push(touch);
        touchElements[touch.identifier] = touchElement;
    }
    resetAnimations();
    resetDebounceTimer();
}
// Handle touch move event
function handleTouchMove(event) {
    event.preventDefault();
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var touchElement = touchElements[touch.identifier];
        if (touchElement) {
            touchElement.style.left = "".concat(touch.clientX, "px");
            touchElement.style.top = "".concat(touch.clientY, "px");
        }
    }
}
// Handle touch end event
function handleTouchEnd(event) {
    event.preventDefault();
    resetAnimations();
    if (isLoading) {
        cancelLoading();
    }
    var _loop_1 = function (i) {
        var touch = event.changedTouches[i];
        var touchElement = touchElements[touch.identifier];
        if (touchElement) {
            touchArea.removeChild(touchElement);
            delete touchElements[touch.identifier];
        }
        currentTouches = currentTouches.filter(function (t) { return t.identifier !== touch.identifier; });
        if (currentTouches.length === 0) {
            resetApp();
        }
    };
    for (var i = 0; i < event.changedTouches.length; i++) {
        _loop_1(i);
    }
    resetDebounceTimer();
}
// Reset debounce timer for loading animation
function resetDebounceTimer() {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }
    debounceTimeout = window.setTimeout(function () {
        if (currentTouches.length > 0) {
            startLoadingAnimation();
        }
    }, 1500);
}
// Start the loading animation
function startLoadingAnimation() {
    isLoading = true;
    debounceTimeout = null;
    loadingTimeout = window.setTimeout(function () {
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
    var randomIndex = Math.floor(Math.random() * currentTouches.length);
    var selectedTouch = currentTouches[randomIndex];
    var touchElement = touchElements[selectedTouch.identifier];
    if (touchElement) {
        touchElement.classList.add("selected");
        for (var _i = 0, currentTouches_1 = currentTouches; _i < currentTouches_1.length; _i++) {
            var touch = currentTouches_1[_i];
            if (touch.identifier !== selectedTouch.identifier) {
                var otherElement = touchElements[touch.identifier];
                if (otherElement) {
                    touchArea.removeChild(otherElement);
                    delete touchElements[touch.identifier];
                }
            }
        }
    }
    currentTouches = currentTouches.filter(function (t) { return t.identifier === selectedTouch.identifier; });
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
    for (var identifier in touchElements) {
        var touchElement = touchElements[identifier];
        if (touchElement && touchElement.parentNode) {
            touchArea.removeChild(touchElement);
        }
    }
    touchElements = {};
    currentTouches = [];
}
// Reset animations for all current touch points
function resetAnimations() {
    var _loop_2 = function (touch) {
        var touchElement = touchElements[touch.identifier];
        if (touchElement) {
            touchElement.style.animation = "none";
            setTimeout(function () {
                touchElement.style.animation = "";
            }, 0);
        }
    };
    for (var _i = 0, currentTouches_2 = currentTouches; _i < currentTouches_2.length; _i++) {
        var touch = currentTouches_2[_i];
        _loop_2(touch);
    }
}
