<script lang="ts">
  import { onMount } from 'svelte';
  import { mountZephyrWelcome } from './zephyr-welcome';

  const SVELTE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 128 128"><path fill="#ff3e00" d="M110.4 18.7C97.5 1.4 74-4.2 55.4 5.2L25.3 22.7C18 27 12.8 33.8 10.4 41.8c-1.8 6.3-1.7 13 .2 19.2-2.4 3.6-4.1 7.6-5.1 11.8-2.8 11.7.2 24 8 33.2C26.4 123.3 50 129 68.5 119.5l30-17.5c7.4-4.3 12.6-11.1 15-19.1 1.8-6.3 1.7-13-.2-19.2 2.4-3.6 4.1-7.6 5.1-11.8 2.9-11.7-.2-24-8-33.2"/><path fill="#fff" d="M55 107.5c-10.4 2.8-21.4-.7-28-8.8-4-5.2-5.5-11.7-4.4-18 .2-.7.4-1.5.6-2.2l.5-1.5 1.3 1c3.6 2.6 7.5 4.6 11.7 5.9l1.1.3-.1 1.1c-.1 2.2.7 4.4 2.2 6 2.7 3 7 4 10.7 2.5l30-17.5c2-1.1 3.4-3 3.9-5.2.5-2.3 0-4.7-1.5-6.5-2.7-3-7-4-10.8-2.5l-11.5 6.7c-9.2 5-20.6 3.3-28-4.2-4-5.2-5.5-11.7-4.4-18s5-11.8 10.8-14.2l30-17.5c9.2-5 20.6-3.3 28 4.2 4 5.2 5.5 11.7 4.4 18-.2.7-.4 1.5-.6 2.2l-.5 1.5-1.3-1c-3.6-2.6-7.5-4.6-11.7-5.9l-1.1-.3.1-1.1c.1-2.2-.7-4.4-2.2-6-2.7-3-7-4-10.7-2.5l-30 17.5c-2 1.1-3.4 3-3.9 5.2-.5 2.3 0 4.7 1.5 6.5 2.7 3 7 4 10.8 2.5l11.5-6.7c9.2-5 20.6-3.3 28 4.2 4 5.2 5.5 11.7 4.4 18s-5 11.8-10.8 14.2z"/></svg>`;

  const VITE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 32 32"><g fill="none"><path fill="url(#a)" d="m29.884 6.146-13.142 23.5a.714.714 0 01-1.244.005L2.096 6.148a.714.714 0 01.746-1.057l13.156 2.352a.7.7 0 00.253 0l12.881-2.348a.714.714 0 01.752 1.05z"/><path fill="url(#b)" d="M22.264 2.007L12.54 3.912a.36.36 0 00-.288.33l-.598 10.104a.357.357 0 00.437.369l2.707-.625a.357.357 0 01.43.42l-.804 3.939a.357.357 0 00.454.413l1.672-.508a.357.357 0 01.454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222 7.925-15.815a.357.357 0 00-.387-.51l-2.787.537a.357.357 0 01-.41-.45l1.818-6.306a.357.357 0 00-.412-.45"/><defs><linearGradient id="a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs></g></svg>`;

  let container: HTMLDivElement;

  onMount(() => {
    mountZephyrWelcome(container, {
      title: 'Svelte + Vite',
      slug: 'frameworks/svelte-vite',
      bundlerName: 'Vite',
      frameworkLogo: `<a href="https://svelte.dev" target="_blank">${SVELTE_LOGO}</a>`,
      bundlerLogo: `<a href="https://vite.dev" target="_blank">${VITE_LOGO}</a>`,
      pills: ['Svelte', 'Vite', 'TypeScript', 'Zephyr Cloud'],
    });
  });
</script>

<div bind:this={container}></div>
