import { Phase } from '@/utils/store';

export const getPhaseName = (phase: Phase): string => {
  switch (phase) {
    case Phase.DEPLOY:
      return 'Deploying';
    case Phase.ATTACK:
      return 'Attacking';
    case Phase.FORTIFY:
      return 'Fortifying';
    case Phase.ENDTURN:
      return 'End Turn';
    default:
      return 'Unknown';
  }
};
