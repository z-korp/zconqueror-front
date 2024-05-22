import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { dojoConfig } from '../dojoConfig.ts';
import App from './App.tsx';
import { setup } from './dojo/setup';
import { DojoProvider } from './dojo/DojoContext.tsx';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import './index.css';
import { AudioSettingsProvider } from './contexts/AudioContext.tsx';
import { StarknetConfig, argent, braavos } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import { katana, provider } from './katana.tsx';

async function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('React root not found');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const chains = [katana, sepolia];
  const connectors = [braavos(), argent()];

  const setupResult = await setup(dojoConfig);
  root.render(
    <React.StrictMode>
      <StarknetConfig chains={chains} provider={() => provider(katana)} connectors={connectors} autoConnect>
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
      </StarknetConfig>
    </React.StrictMode>
  );
}

init();
