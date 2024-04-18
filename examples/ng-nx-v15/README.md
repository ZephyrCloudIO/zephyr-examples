# Angular + nx v15 deployment demo

This readme explains why attaching Zephyr to Angular CLI is a bit more complicated they just one `withZephyr()` line.

Since Angular v8, Angular CLI builds `index.html` outside of webpack build process.
Meaning that we can't just add a plugin to webpack and expect it to work.

In a nutshell, Angular CLI does the following:
1. Starts webpack build and waits for it to finish
2. Builds `index.html` using `@angular-devkit/build-angular:html`
3. `process.exit(0)` if there are no errors

`withZephyr()` attaches to webpack build process, while to have `index.html` we need to intercept it in index-html-transform and make Angular CLI wait for deployment to finish.

## How to attach Zephyr to Angular CLI

1. Install `zephyr-webpack-plugin` as a dev dependency
2. Install `@angular-builders/custom-webpack` as a dev dependency (this is needed to modify Angular CLI webpack config)
3. Create a `webpack.config.js` file in the root of your project
    ```js
    const {withZephyr} = require('zephyr-webpack-plugin');
    
    // shorthand for: module.exports = (config) => withZephyr({wait_for_index_html: true})(config);
    module.exports = withZephyr({wait_for_index_html: true});
    ```
4. Create `index-html-transform.js` file in the root of your project
    ```js
    const { resolveIndexHtml, onDeploymentDone } = require('zephyr-webpack-plugin');
    
    module.exports = async (targetOptions, indexHtml) => {
        resolveIndexHtml(indexHtml);
        await onDeploymentDone();
        return indexHtml;
    };
    ```
5. Modify build executor in `angular.json` or `project.json` to use custom webpack config and index transform
    ```json
    "build": {
        "builder": "@angular-builders/custom-webpack:browser",
        "options": {
            "customWebpackConfig": {
                "path": "./webpack.config.js"
            },
            "indexTransform": "./index-html-transform.js"
        }
    }
    ```
