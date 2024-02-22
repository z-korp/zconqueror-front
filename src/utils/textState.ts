import { Phase } from '@/utils/store';

export const getPhaseName = (phase: Phase): string => {
  switch (phase) {
    case Phase.DEPLOY:
      return 'Deploying';
    case Phase.ATTACK:
      return 'Attacking';
    case Phase.FORTIFY:
      return 'Fortifying';
    default:
      return 'Unknown';
  }
};
