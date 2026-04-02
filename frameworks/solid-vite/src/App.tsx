import { onMount } from 'solid-js';
import { mountZephyrWelcome } from '../../_shared/zephyr-welcome';

const SOLID_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 128 128"><path fill="#76b3e1" d="M4.9 46.7C17.4 23.3 44.2 9.3 71.1 12.5c0 0 31.6 3 47.8 28.4 0 0-16.2-22.4-44.2-29.7C46.7 4 22.5 16.8 4.9 46.7"/><path fill="#518ac8" d="M4.9 46.7s18.8-29 52-32.4c0 0 37 2 52.9 32.8 0 0-11.4-24-43.2-34.2C42.4 5.9 17 18.5 4.9 46.7"/><path fill="#2c4f7c" d="M32.4 76.9c-3.5 16.4 3.8 29 12.8 37.5 0 0-17.5-9.7-26.2-27.1-12.4-24.5 1-56.6 44.5-65.1 5.3-1 10.8 0 15.4 2.7.8.5 1.3 1.4 1.3 2.4.1 2-2.4 3.1-3.8 1.7l-.3-.3C60.3 16 34.6 40.4 32.4 76.9"/><path fill="#4377bb" d="M88.5 45.7c-.6-2-3.3-2.6-4.7-1.1-.2.2-.4.4-.5.7C70 64.8 65.1 88.5 74.2 110.4l.2.5c3.6 8.3 15.1 17.1 15.1 17.1-12.6-4.8-22.2-14.5-29-27.7C49.2 80 60.5 55 88.5 45.7"/><path fill="#2c4f7c" d="M109.2 47.1c4.5 8.2 6.8 17.4 6.7 26.8-1.1 28.3-29.2 45.4-50.7 50.1 0 0 34.9-2.7 52.6-31.2 8.6-13.8 6.6-34.3-8.6-45.7"/></svg>`;

const VITE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 32 32"><g fill="none"><path fill="url(#a)" d="m29.884 6.146-13.142 23.5a.714.714 0 01-1.244.005L2.096 6.148a.714.714 0 01.746-1.057l13.156 2.352a.7.7 0 00.253 0l12.881-2.348a.714.714 0 01.752 1.05z"/><path fill="url(#b)" d="M22.264 2.007L12.54 3.912a.36.36 0 00-.288.33l-.598 10.104a.357.357 0 00.437.369l2.707-.625a.357.357 0 01.43.42l-.804 3.939a.357.357 0 00.454.413l1.672-.508a.357.357 0 01.454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222 7.925-15.815a.357.357 0 00-.387-.51l-2.787.537a.357.357 0 01-.41-.45l1.818-6.306a.357.357 0 00-.412-.45"/><defs><linearGradient id="a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs></g></svg>`;

function App() {
  let container!: HTMLDivElement;

  onMount(() => {
    mountZephyrWelcome(container, {
      title: 'Solid + Vite',
      slug: 'frameworks/solid-vite',
      bundlerName: 'Vite',
      frameworkLogo: `<a href="https://solidjs.com" target="_blank">${SOLID_LOGO}</a>`,
      bundlerLogo: `<a href="https://vite.dev" target="_blank">${VITE_LOGO}</a>`,
      pills: ['Solid', 'Vite', 'TypeScript', 'Zephyr Cloud'],
    });
  });

  return <div ref={container} />;
}

export default App;
