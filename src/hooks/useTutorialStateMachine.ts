import { useState, useEffect } from 'react';

// Étapes du tutoriel
export const TutorialSteps = {
  STEP_1: 'STEP_1',
  STEP_2: 'STEP_2',
  STEP_3: 'STEP_3',
  // Ajoutez autant d'étapes que nécessaire
};

// Définition de la machine à états
export const useTutorialStateMachine = (gameState) => {
  const [currentStep, setCurrentStep] = useState(TutorialSteps.STEP_1);

  // Met à jour l'étape du tutoriel en fonction de l'état du jeu
  useEffect(() => {
    // Logique de transition entre les étapes en fonction de l'état du jeu
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
      // Ajoutez des cas pour chaque état du jeu pertinent
      default:
        setCurrentStep(TutorialSteps.STEP_1); // Défaut à l'étape 1 si l'état n'est pas géré
    }
  }, [gameState]);

  const nextStep = () => {
    // Implémentez ici la logique pour passer à l'étape suivante
    // Par exemple, si vous voulez passer à l'étape suivante dans l'ordre STEP_1 -> STEP_2 -> STEP_3 -> STEP_1, vous pouvez faire comme ceci :
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case TutorialSteps.STEP_1:
          return TutorialSteps.STEP_2;
        case TutorialSteps.STEP_2:
          return TutorialSteps.STEP_3;
        case TutorialSteps.STEP_3:
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
