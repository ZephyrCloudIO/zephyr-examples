interface AppValidation {
  uniqueText: string[];
}

// App-specific validation rules with unique content to verify correct deployment
export const APP_VALIDATIONS: Record<string, AppValidation> = {
  // Framework-specific apps
  "angular-vite-zephyr-template": {
    uniqueText: ["Angular", "Vite"],
  },
  "react-vite-ts": {
    uniqueText: ["Vite", "React"],
  },
  "ember-vite": {
    uniqueText: ["Congratulations", "Quick start"]
  },
  "solid-zephyr-template": {
    uniqueText: ["Solid", "Vite"],
  },
  "svelte-zephyr-template": {
    uniqueText: ["Svelte", "Vite"],
  },
  "modern-js": {
    uniqueText: ["Modern.js", "Get Started"],
  },
  "nx-ng": {
    uniqueText: ["Welcome", "Hello there"],
  },
  "parcel-react": {
    uniqueText: ["Hello", "Zephyr", "Parcel"],
  },
  "rspack-react-starter": {
    uniqueText: ["Rspack", "React"],
  },
  "rolldown-react": {
    uniqueText: ["Rolldown", "React"],
  },
  "rollup-react-ts": {
    uniqueText: ["Rollup", "React"],
  },
  "rspress-ssg": {
    uniqueText: ["My Site", "A cool website!"],
  },

  // Module Federation apps
  "create-mf-app-rspack-host": {
    uniqueText: ["with zephyr", "react", "TypeScript"],
  },
  "default-webpack-mf-first": {
    uniqueText: ["App1", "App 2"],
  },
  "default-webpack-mf-second": {
    uniqueText: ["App 2"],
  },
  host: {
    uniqueText: ["Hello there", "Welcome host", "Remote1", "Remote2"],
  },
  "rspack-remote1": {
    uniqueText: ["Hello there", "Welcome rspack_remote1"],
  },
  "rspack-remote2": {
    uniqueText: ["Hello there", "Welcome rspack_remote2"],
  },
  shell: {
    uniqueText: ["Hello there", "Welcome shell"],
  },
  remote1: {
    uniqueText: ["Remote 1", "Module Federation"],
  },
  remote2: {
    uniqueText: ["Remote 2", "Module Federation"],
  },

  // Airbnb clone microfrontends
  "airbnb-react-host": {
    uniqueText: ["Airbnb", "your home"],
  },
  "airbnb-categories": {
    uniqueText: ["Beach", "Windmills"],
  },
  "airbnb-favorites": {
    uniqueText: ["Favorites", "favorited"],
  },
  "airbnb-home": {
    uniqueText: ["Americas", "Europe"],
  },
  "airbnb-properties": {
    uniqueText: ["Properties", "List of your properties"],
  },
  "airbnb-reservations": {
    uniqueText: ["Reservations", "Bookings on your properties"],
  },
  "airbnb-trips": {
    uniqueText: ["Trips", "Where you've been and where you're going"],
  },

  // Basehref examples
  "basehref-rspack-app": {
    uniqueText: ["Rspack", "React", "TypeScript"],
  },
  "basehref-vite-app": {
    uniqueText: ["BaseHref Vite Example", "Configuration Info"],
  },
  "basehref-webpack-app": {
    uniqueText: ["BaseHref Webpack Example", "Navigation"],
  },

  // Tractor v2 microfrontends
  "tractor-v2-app": {
    uniqueText: [
      "Machines",
      "Stores",
      "Classic Tractors",
      "Autonomous Tractors",
    ],
  },
  "tractor-v2-checkout": {
    uniqueText: ["Checkout Remote", "Cart Page"],
  },
  "tractor-v2-decide": {
    uniqueText: ["Decide Remote", "Product Page"],
  },
  "tractor-v2-explore": {
    uniqueText: ["Explore Remote", "Home Page"],
  },

  // Team microfrontends
  "team-blue": {
    uniqueText: ["basket", "item"],
  },
  "team-green": {
    uniqueText: ["Related", "Products"],
  },
  "team-red": {
    uniqueText: ["The Model Store", "Tractor"],
  },

  // Vite microfrontends
  "vite-host": {
    uniqueText: ["button from Vite remote", "component from Webpack", "component from Rspack", "Vite + React"],
  },
  "vite-remote": {
    uniqueText: ["Vite + React", "button"],
  },
  "vite-rspack": {
    uniqueText: ["This is a component from Rspack.", "react"],
  },
  "vite-webpack": {
    uniqueText: ["This is a component from Webpack.", "Button"],
  },

  // Additional apps found in deployment
  "-react-vite-nx-source": {
    uniqueText: ["Welcome react-vite-nx", "Hello there"],
  },

  // Turbo apps - currently disabled due to deployment issues
  // "turbo-host": {
  //   uniqueText: ["Turbo", "Host"],
  // },
  // "turbo-home": {
  //   uniqueText: ["Turbo", "Home"],
  // },
  // "turbo-settings": {
  //   uniqueText: ["Turbo", "Settings"],
  // },
};
