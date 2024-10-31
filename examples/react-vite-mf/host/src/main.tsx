import { init } from '@module-federation/runtime';

init({
  name: 'vite-host',
  remotes: [],
});

import('./bootstrap');
