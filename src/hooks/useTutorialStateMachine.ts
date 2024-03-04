import { useState, useEffect } from 'react';

// Étapes du tutoriel
export const TutorialSteps = {
  STEP_1: 'STEP_1',
  STEP_2: 'STEP_2',
  STEP_3: 'STEP_3',
  STEP_4: 'STEP_4',
  STEP_5: 'STEP_5',
  STEP_6: 'STEP_6',
  STEP_7: 'STEP_7',
  STEP_8: 'STEP_8',
};

export const useTutorialStateMachine = (gameState) => {
  const [currentStep, setCurrentStep] = useState(TutorialSteps.STEP_1);

  useEffect(() => {
    switch (gameState) {
      case 'STATE_1':
        setCurrentStep(TutorialSteps.STEP_1);
        break;
      case 'STATE_2':
        setCurrentStep(TutorialSteps.STEP_2);
        break;
      case 'STATE_3':
        setCurrentStep(TutorialSteps.STEP_3);
        break;
      case 'STATE_4':
        setCurrentStep(TutorialSteps.STEP_4);
        break;
      case 'STATE_5':
        setCurrentStep(TutorialSteps.STEP_5);
        break;
      case 'STATE_6':
        setCurrentStep(TutorialSteps.STEP_6);
        break;
      case 'STATE_7':
        setCurrentStep(TutorialSteps.STEP_7);
        break;
      case 'STATE_8':
        setCurrentStep(TutorialSteps.STEP_8);
        break;
      default:
        setCurrentStep(TutorialSteps.STEP_1); // Défaut à l'étape 1 si l'état n'est pas géré
    }
  }, [gameState]);

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case TutorialSteps.STEP_1:
          return TutorialSteps.STEP_2;
        case TutorialSteps.STEP_2:
          return TutorialSteps.STEP_3;
        case TutorialSteps.STEP_3:
          return TutorialSteps.STEP_4;
        case TutorialSteps.STEP_4:
          return TutorialSteps.STEP_5;
        case TutorialSteps.STEP_5:
          return TutorialSteps.STEP_6;
        case TutorialSteps.STEP_6:
          return TutorialSteps.STEP_7;
        case TutorialSteps.STEP_7:
          return TutorialSteps.STEP_8;
        case TutorialSteps.STEP_8:
          return TutorialSteps.STEP_1;
        default:
          return prevStep;
      }
    });
  };

  const resetTutorial = () => {
    setCurrentStep(TutorialSteps.STEP_1); // Réinitialiser le tutoriel à l'étape 1
  };

  return { currentStep, nextStep, resetTutorial };
};
