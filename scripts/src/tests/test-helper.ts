import { getAllAppDeployResults } from "zephyr-agent";

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

export const getDeployedApps = async (): Promise<DeployedApp[]> => {
  try {
    const deployResults = await getAllAppDeployResults();

    if (!deployResults || typeof deployResults !== 'object') {
      console.log('No deployment results returned');
      return [];
    }

    const deployed = Object.entries(deployResults)
      .filter(([_, result]: [string, any]) => {
        // Filter out invalid entries
        return result && result.urls && Array.isArray(result.urls) && result.urls.length > 0;
      })
      .map(([app, result]: [string, any]) => ({
        app: app,
        name: app.split(".")[0],
        url: result.urls[0],
      }));

    deployed.sort((a, b) => (a.app > b.app ? 1 : -1));
    return deployed;
  } catch (error: any) {
    console.error(`Failed to get deployment results:`, error);
    console.error(`Error details: ${error.message}`);
    console.error(`Error code: ${error.code}`);

    // Return empty array on error so tests can report "no deployments found"
    // rather than crashing
    return [];
  }
};
