import manifest from './src/dojo/manifest.json';
import { createDojoConfig } from '@dojoengine/core';

export const dojoConfig = createDojoConfig({
  manifest,
});
