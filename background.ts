
/**
 * BACKGROUND SERVICE WORKER
 */

// Fix: Declare chrome as a global variable for use in background service worker context
declare const chrome: any;

// Register extension lifecycle listeners
chrome.runtime.onInstalled.addListener(() => {
  console.log('Teams StayAlive Pro Installed');
  // Set initial state
  chrome.storage.local.set({ active: false });
});

// Simple keep-alive for the service worker
// The 'alarms' permission in manifest.json is required for this to not throw error 15
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm: any) => {
  if (alarm.name === 'keepAlive') {
    console.debug('StayAlive service worker heartbeat');
  }
});

// Listener for messages from the popup if needed for background persistence
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['active'], (result: any) => {
      sendResponse({ active: result.active || false });
    });
    return true; // Keep channel open for async response
  }
});
