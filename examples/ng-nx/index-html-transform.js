const { resolveIndexHtml, onDeploymentDone } = require('zephyr-webpack-plugin');

module.exports = async (targetOptions, indexHtml) => {
    resolveIndexHtml(indexHtml);
    await onDeploymentDone();
    return indexHtml;
};


