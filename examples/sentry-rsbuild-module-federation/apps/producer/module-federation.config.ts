export const config = {
  name: "producer",
  filename: "remoteEntry.js",
  exposes: {
    "./Producer": "./src/RemoteEntry.tsx",
  },
  shared: ["react", "react-dom", "@sentry/react"],
};
