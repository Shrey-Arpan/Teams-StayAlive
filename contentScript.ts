/**
 * CONTENT SCRIPT FOR TEAMS STAYALIVE
 * This script runs inside the Teams tab to intercept visibility signals.
 */

// Fix: Added export {} to turn this file into a module and isolate the scope of 'chrome'
export {};

// Fix: Declare chrome global to fix compilation errors when using extension runtime APIs
declare const chrome: any;

(function() {
  let isAlwaysActive = true;

  // Listen for toggle messages from the popup
  // Fix: Access chrome.runtime safely with the global declaration
  chrome.runtime.onMessage.addListener((request: any) => {
    if (request.type === 'TOGGLE_STATUS') {
      isAlwaysActive = request.active;
      console.log(`[StayAlive] Status set to: ${isAlwaysActive ? 'Always Active' : 'Normal'}`);
    }
  });

  // Function to overwrite visibility properties
  function spoofVisibility() {
    if (!isAlwaysActive) return;

    // Overwrite document.visibilityState
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true
    });

    Object.defineProperty(document, 'hidden', {
      value: false,
      configurable: true
    });
  }

  // Prevent visibilitychange events from firing
  window.addEventListener('visibilitychange', (e) => {
    if (isAlwaysActive) {
      e.stopImmediatePropagation();
    }
  }, true);

  // Prevent blur events (Teams uses these to detect focus loss)
  window.addEventListener('blur', (e) => {
    if (isAlwaysActive) {
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('focusout', (e) => {
    if (isAlwaysActive) {
      e.stopImmediatePropagation();
    }
  }, true);

  // Periodic dummy activity pulse to keep the web socket/session alive
  setInterval(() => {
    if (isAlwaysActive) {
      // Dispatch a subtle mouse event that doesn't disrupt user
      const evt = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: Math.random() * 10,
        clientY: Math.random() * 10
      });
      document.dispatchEvent(evt);
      
      // Attempt to spoof focus if lost
      if (document.visibilityState !== 'visible') {
        spoofVisibility();
      }
    }
  }, 30000); // Pulse every 30 seconds

  // Initialize
  spoofVisibility();
  console.log("[StayAlive] Content script injected and active.");
})();