import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface TutorialContextType {
  showTuto: boolean;
  setShowTuto: (show: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: FC<TutorialProviderProps> = ({ children }) => {
  const [showTuto, setShowTuto] = useState<boolean>(true);

  return <TutorialContext.Provider value={{ showTuto, setShowTuto }}>{children}</TutorialContext.Provider>;
};
