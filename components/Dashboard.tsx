
import React, { useState } from 'react';
import { generateStatusMessage } from '../services/geminiService';

declare const chrome: any;

interface DashboardProps {
  isActive: boolean;
  toggleStatus: () => void;
  lastActivity: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ isActive, toggleStatus, lastActivity }) => {
  const [suggestedStatus, setSuggestedStatus] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateStatus = async () => {
    setIsGenerating(true);
    try {
      const msg = await generateStatusMessage();
      setSuggestedStatus(msg || 'Focusing on deep work...');
    } catch (error) {
      setSuggestedStatus('Available for urgent requests.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenTeams = () => {
    chrome.tabs.create({ url: 'https://teams.microsoft.com/' });
  };

  return (
    <div className="space-y-4">
      <div className="card-premium p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-gray-700 m-0 text-sm">Presence Guard</h2>
            <p className="text-xs text-gray-500 m-0">Bypasses inactivity timeouts</p>
          </div>
          <button
            onClick={toggleStatus}
            className={`toggle-switch ${isActive ? 'active' : ''}`}
            aria-label="Toggle Status"
          >
            <span className="toggle-circle" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="block text-small-caps uppercase font-bold text-gray-400">Current Status</span>
            <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
              {isActive ? 'Always Active' : 'System Default'}
            </span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="block text-small-caps uppercase font-bold text-gray-400">Last Trigger</span>
            <span className="text-sm font-medium text-gray-600">{lastActivity}</span>
          </div>
        </div>
      </div>

      <div className="card-premium p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 m-0">Active Modules</h3>
        <ul className="space-y-3 p-0 m-0 list-none">
          <FeatureItem icon="👁️" title="Visibility Spoofing" description="Maintains 'Visible' state on hidden tabs" enabled={isActive} />
          <FeatureItem icon="🖱️" title="Activity Pulse" description="Simulates subtle interactions" enabled={isActive} />
          <FeatureItem icon="⌨️" title="Focus Preservation" description="Prevents blur event detection" enabled={isActive} />
        </ul>
      </div>

      <div className="card-premium p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 m-0">Smart Status Message</h3>
          <button
            onClick={handleGenerateStatus}
            disabled={isGenerating}
            className="btn-premium p-1.5 rounded-full !shadow-none"
            title="Generate with Gemini"
          >
            <svg className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="bg-teams-purple-faint border-teams-purple-20 border rounded-lg p-3 min-h-[60px] flex items-center justify-center" style={{ borderStyle: 'solid' }}>
          {suggestedStatus ? (
            <p className="text-sm text-[#6264A7] italic m-0">"{suggestedStatus}"</p>
          ) : (
            <p className="text-xs text-gray-400 text-center m-0">Click refresh to generate a convincing status message using Gemini</p>
          )}
        </div>
        {suggestedStatus && (
          <button
            onClick={() => navigator.clipboard.writeText(suggestedStatus)}
            className="mt-2 w-full text-xs text-teams-purple font-medium hover:underline text-right bg-transparent border-none cursor-pointer"
          >
            Copy to Clipboard
          </button>
        )}
      </div>

      <div className="flex gap-3 px-1">
        <button
          onClick={handleOpenTeams}
          className="btn-premium flex-1 !bg-white !text-teams-purple border border-teams-purple !shadow-none hover:!bg-teams-bg"
        >
          <span className="text-xl">🏢</span> Open Teams
        </button>
        <button
          disabled={!isActive}
          onClick={() => {
            chrome.storage.local.set({ lastActivity: new Date().toLocaleTimeString() });
            window.location.reload();
          }}
          className={`btn-premium flex-1 ${!isActive ? '!opacity-50' : ''}`}
        >
          <span className="text-xl">⚡</span> Force Pulse
        </button>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: string; title: string; description: string; enabled: boolean }> = ({ icon, title, description, enabled }) => (
  <li className="flex gap-3">
    <div className="text-xl">{icon}</div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 m-0">{title}</h4>
        {enabled && <span className="text-small-caps bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
      </div>
      <p className="text-xs text-gray-500 m-0">{description}</p>
    </div>
  </li>
);
