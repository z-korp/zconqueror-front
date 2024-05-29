import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { dojoConfig } from '../dojoConfig.ts';
import { setup } from './dojo/setup';
import { DojoProvider } from './dojo/DojoContext.tsx';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AudioSettingsProvider } from './contexts/AudioContext.tsx';
import { StarknetConfig, jsonRpcProvider } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import cartridgeConnector from './cartridgeConnector.tsx';
import App from './App.tsx';

import './index.css';

function rpc() {
  return {
    nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
  };
}

async function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('React root not found');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const chains = [sepolia];
  const connectors = [cartridgeConnector];

  const setupResult = await setup(dojoConfig);
  root.render(
    <React.StrictMode>
      <StarknetConfig chains={chains} provider={jsonRpcProvider({ rpc })} connectors={connectors} autoConnect>
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
