
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';

declare const chrome: any;

const App: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<string>('Never');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['active', 'lastActivity'], (result: any) => {
        if (result.active !== undefined) setIsActive(result.active);
        if (result.lastActivity) setLastActivity(result.lastActivity);
      });
    } else {
      const savedState = localStorage.getItem('teams_stayalive_active');
      if (savedState === 'true') setIsActive(true);
      const savedTime = localStorage.getItem('teams_stayalive_last');
      if (savedTime) setLastActivity(savedTime);
    }
  }, []);

  const toggleStatus = () => {
    const newState = !isActive;
    const now = new Date().toLocaleTimeString();

    setIsActive(newState);
    setLastActivity(now);

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ active: newState, lastActivity: now });

      chrome.tabs.query({ url: ["https://teams.microsoft.com/*", "https://teams.live.com/*"] }, (tabs: any[]) => {
        tabs.forEach(tab => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_STATUS', active: newState }, () => {
              if (chrome.runtime.lastError) {
                // Silently ignore if tab is not ready or has no renderer
                console.debug('Message failed (expected for some tabs):', chrome.runtime.lastError.message);
              }
            });
          }
        });
      });
    } else {
      localStorage.setItem('teams_stayalive_active', newState.toString());
      localStorage.setItem('teams_stayalive_last', now);
    }
  };

  return (
    <div className="h-full flex flex-col bg-teams-bg text-[#242424]">
      <header className="bg-teams-purple p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-teams-purple" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <h1 className="font-bold text-lg m-0">StayAlive Pro</h1>
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: isActive ? '#4ade80' : '#9ca3af',
            boxShadow: isActive ? '0 0 8px rgba(74,222,128,0.8)' : 'none'
          }}
        />
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Dashboard
          isActive={isActive}
          toggleStatus={toggleStatus}
          lastActivity={lastActivity}
        />
      </main>

      <footer className="p-4 text-center text-xs text-gray-500 bg-white border-t border-gray-200">
        <p className="m-0">Built for Microsoft Teams Web</p>
        <p className="mt-1 m-0">Ensures visibility & activity signals remain persistent.</p>
        <p className="mt-1 m-0">by Shrey Arpan</p>
      </footer>
    </div>
  );
};

export default App;
