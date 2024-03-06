import React, { createContext, useContext, useState } from 'react';

const TutorialContext = createContext();

export const useTutorial = () => useContext(TutorialContext);

export const TutorialProvider = ({ children }) => {
  const [showTuto, setShowTuto] = useState(true);

  return <TutorialContext.Provider value={{ showTuto, setShowTuto }}>{children}</TutorialContext.Provider>;
};
