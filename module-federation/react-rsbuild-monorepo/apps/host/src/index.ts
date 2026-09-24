import('./bootstrap').catch((error: unknown) => {
  console.error('Host bootstrap failed', error);
});
