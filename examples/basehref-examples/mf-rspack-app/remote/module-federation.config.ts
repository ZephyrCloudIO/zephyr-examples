export const mfConfig = {
  name: "remote",
  filename: "remoteEntry.js",
  exposes: {
    "./recipe": "./src/Recipe.tsx",
  },
  shared: ["react", "react-dom"],
};
