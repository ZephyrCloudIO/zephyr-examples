const { getAllAppDeployResults } = require('zephyr-agent');

const getDeployedApps = async () => {
  try {
    const deployResults = await getAllAppDeployResults();
    const deployed = Object.entries(deployResults).map(([app, result]) => ({
      app: app.replace('.', ''),
      name: app.replace('.', ''),
      url: result.urls[0]
    }));
    deployed.sort((a, b) => (a.app > b.app ? 1 : -1));
    return deployed;
  } catch (error) {
    console.log(`Failed to get deployment results: ${error.message}`);
    return [];
  }
};

module.exports = {
  getDeployedApps
};