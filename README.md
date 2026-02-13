# Teams StayAlive Pro

Keep your Microsoft Teams status always active with automated visibility spoofing and activity signals.

## Features
- **Always Active**: Prevents Teams from going idle or away.
- **Visibility Spoofing**: Maintains "Visible" state even when the tab is in the background.
- **Activity Pulse**: Simulates subtle mouse movements to maintain session activity.
- **Smart Status**: Generate professional status messages using Gemini AI.

## Getting Started

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Configuration
NOT MANDATORY (Optional)
Create a `.env.local` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Build for Production
To generate the extension files:
```bash
npm run build
```
This will create a `dist` folder containing the compiled extension.

## Deployment (Loading into Chrome)

To load the extension into your browser:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the **`dist`** folder from this project directory.
5. Pin the "Teams StayAlive Pro" extension from the puzzle icon menu.

## Development
To run the dashboard UI in development mode (with Hot Module Replacement):
```bash
npm run dev
```
*Note: Some extension-specific features (like storage or messaging) may require the extension to be loaded in Chrome to function correctly.*
