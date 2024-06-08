import React, { useEffect, useState } from 'react';
import { dojoConfig } from '../../dojoConfig';
import App from '../App';
import { setup, SetupResult } from '../dojo/setup';
import { DojoProvider } from '../dojo/DojoContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AudioSettingsProvider } from '../contexts/AudioContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './Loading';

const InitApp = () => {
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await setup(dojoConfig);
        setSetupResult(result);
      } catch (error) {
        console.error('Setup failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return (
      <div className="font-vt323 w-full relative h-screen">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-96 rounded-lg uppercase text-white text-4xl bg-stone-500 text-center">
          zConqueror
        </div>
        <div className="h-full flex pt-16 justify-center">
          <Loading text="Preparing the battlefield" />
        </div>
      </div>
    );
  }

  return (
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
          </AudioSettingsProvider>
        </TooltipProvider>
      </DojoProvider>
    </React.StrictMode>
  );
};

export default InitApp;
