import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { dojoConfig } from '../dojoConfig.ts';
import App from './App.tsx';
import { setup } from './dojo/setup';
import { DojoProvider } from './dojo/DojoContext.tsx';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import './index.css';
import { AudioSettingsProvider } from './contexts/AudioContext.tsx';

async function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('React root not found');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const setupResult = await setup(dojoConfig);
  root.render(
    <React.StrictMode>
      <DojoProvider value={setupResult}>
        <TooltipProvider>
          <AudioSettingsProvider>
            <Router>
              <Routes>
                <Route path="" element={<App />} />
                <Route path="/:id" element={<App />} />
              </Routes>
            </Router>
            {/* <App /> */}
          </AudioSettingsProvider>
        </TooltipProvider>
      </DojoProvider>
    </React.StrictMode>
  );
}

init();
