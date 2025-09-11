import { getAllAppDeployResults } from 'zephyr-agent';

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

export const getDeployedApps = async (): Promise<DeployedApp[]> => {
  try {
    const deployResults = await getAllAppDeployResults();
    const deployed = Object.entries(deployResults).map(([app, result]: [string, any]) => ({
      app: app.replace('.', ''),
      name: app.replace('.', ''),
      url: result.urls[0]
    }));
    deployed.sort((a, b) => (a.app > b.app ? 1 : -1));
    return deployed;
  } catch (error: any) {
    console.log(`Failed to get deployment results: ${error.message}`);
    return [];
  }
};