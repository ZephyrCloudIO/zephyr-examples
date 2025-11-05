// Zephyr automatically resolves remote URLs via the zephyr:dependencies in package.json
// The external-remotes-plugin will resolve [app2Url] at runtime
window.app2Url = window.zephyrRemoteUrlMap?.default_webpack_mf_second || ""

// Use dynamic import here to allow webpack to interface with module federation code
import("./bootstrap");
