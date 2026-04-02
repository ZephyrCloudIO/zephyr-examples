import { pageTitle } from 'ember-page-title';
import { modifier } from 'ember-modifier';
import { mountZephyrWelcome } from '../../../_shared/zephyr-welcome';

const EMBER_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 128 128"><path fill="#e04e39" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0m32.5 89.4c-2.5 3.1-12.6 8.3-25.9 8.3-23.4 0-39.3-14.6-39.3-34.3 0-16 10.4-32.4 30.2-32.4 16.2 0 25 11 25 23.3 0 14.6-10.4 19.2-14.2 19.2-2.3 0-3.5-1.6-3.1-4.5 0 0 3.9-16.1 4.2-17.6.5-2.4-.3-4.2-3.1-4.2-3.3 0-7.5 4-7.5 11.7 0 5.4 2.6 9.6 2.6 9.6s-4.6 19.9-5.4 23.2c-1.5 6.5.2 17.2.4 18.1.1.5.6.6.9.2.4-.6 5.8-8.8 7.3-14.5l3.3-12.1c1.7 3 6.4 5.4 11.5 5.4 15.1 0 26.3-14.4 26.3-32.2C110.5 37.7 94 22 72.5 22c-26 0-43 19-43 40.3 0 20 11.6 34 28.8 34 3.8 0 8.7-1.5 10.3-3.4 0 0 1.4 3.1 7.2 1 3.3-1.2 5.5-3.5 6.7-5z"/></svg>`;

const VITE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 32 32"><g fill="none"><path fill="url(#a)" d="m29.884 6.146-13.142 23.5a.714.714 0 01-1.244.005L2.096 6.148a.714.714 0 01.746-1.057l13.156 2.352a.7.7 0 00.253 0l12.881-2.348a.714.714 0 01.752 1.05z"/><path fill="url(#b)" d="M22.264 2.007L12.54 3.912a.36.36 0 00-.288.33l-.598 10.104a.357.357 0 00.437.369l2.707-.625a.357.357 0 01.43.42l-.804 3.939a.357.357 0 00.454.413l1.672-.508a.357.357 0 01.454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222 7.925-15.815a.357.357 0 00-.387-.51l-2.787.537a.357.357 0 01-.41-.45l1.818-6.306a.357.357 0 00-.412-.45"/><defs><linearGradient id="a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs></g></svg>`;

const mountWelcome = modifier((element) => {
  mountZephyrWelcome(element, {
    title: 'Ember + Vite',
    slug: 'frameworks/ember-vite',
    bundlerName: 'Vite',
    frameworkLogo: `<a href="https://emberjs.com" target="_blank">${EMBER_LOGO}</a>`,
    bundlerLogo: `<a href="https://vite.dev" target="_blank">${VITE_LOGO}</a>`,
    pills: ['Ember', 'Vite', 'TypeScript', 'Zephyr Cloud'],
  });
});

<template>
  {{pageTitle "Ember + Vite"}}

  <div {{mountWelcome}}></div>

  {{outlet}}
</template>
