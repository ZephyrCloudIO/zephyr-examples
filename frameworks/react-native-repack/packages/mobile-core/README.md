# Core SDK

Core app utilities including auth, api, data, events, and UI

Auth part includes:

- `AccountScreen` - displays user token and allows users to log out
- `useAuthStore` - hook that exposes auth state and actions
- `SignInScreen` - displays authentication form, can be used for building custom auth flows

API part includes

- `restClient` - shared axios client instance
- `AuthListenersManager` singleton manages authentication event listeners, updating or clearing the access token based on login, logout, and token refresh events. Use `setupAuthListeners` to initialize listeners and `removeAuthListeners` to clean them up.
- `setAccessToken` - helper for providing authentication header for `restClient`. Not needed to call if `setupAuthListeners` used.
- `clearAccessToken` - helper for deleting authentication header for `restClient`. Not needed to call if `setupAuthListeners` used.
- reexport from `@tanstack/react-query` library

Data part contains:

- reexport from `zustand` library

Events part includes:

- `EventBus` static class is a centralized system for handling events with type safety, allowing to emit and listen to events with or without data payloads.
- `Events` - predefined event types

UI includes:

- custom reusable `components`
- reexport from `react-native-paper`

To login, use any random strings for email and password
