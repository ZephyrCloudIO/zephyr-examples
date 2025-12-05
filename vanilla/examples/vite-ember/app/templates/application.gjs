import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "Vite Ember"}}

  <div style="padding: 2rem; font-family: sans-serif;">
    <h1>Welcome to Ember + Vite</h1>
    <p>This example demonstrates Ember.js with Vite and Zephyr Cloud.</p>
  </div>

  {{outlet}}
</template>
