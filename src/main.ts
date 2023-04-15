import { createPinia } from 'pinia';
// eslint-disable-next-line import/no-unresolved
import { ViteSSG } from 'vite-ssg';
import { plausible } from './plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import { routes } from './router';
import { config } from './config';
import { useToolStore } from './tools/tools.store';

export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes, base: config.app.baseUrl },
  // function to have custom setups
  async ({ app, router, routes, isClient, initialState }) => {
    // install plugins etc.
    const pinia = createPinia();
    app.use(pinia);
    app.use(naive);

    if (import.meta.env.SSR) {
      // this will be stringified and set to window.__INITIAL_STATE__
      initialState.pinia = pinia.state.value;
    } else {
      // on the client side, we restore the state
      pinia.state.value = initialState?.pinia || {};
    }

    if (isClient) {
      app.use(plausible);
      // import { registerSW } from 'virtual:pwa-register';
      // registerSW();
    }
  },
);
